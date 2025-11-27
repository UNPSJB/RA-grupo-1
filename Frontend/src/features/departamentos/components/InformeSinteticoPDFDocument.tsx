// Frontend/src/features/departamentos/components/InformeSinteticoPDFDocument.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../../assets/Unipat.png";

// ---- Tipos que va a recibir desde la página de "guardado" ----

export type TipoRespuestaPDF = "texto" | "tabla";

export interface FilaTablaPDF {
  [columna: string]: string | number | null;
}

export interface RespuestaPDF {
  preguntaId: number;
  codigo?: string;
  enunciado: string;
  tipo: TipoRespuestaPDF;
  texto?: string;
  tabla?: FilaTablaPDF[];
}

export interface CabeceraPDF {
  departamentoId: number;
  carreraId: number;
  sede: string;
  anio: number;
  duracion: string; // "anual", "cuatrimestre_1", etc.
}

export interface InformeSinteticoPDFProps {
  informeId: number;
  titulo: string;
  cabecera: CabeceraPDF;
  respuestas: RespuestaPDF[];
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#333",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2px solid #e2e8f0",
  },
  headerImage: {
    width: 80,
    opacity: 0.5,
    position: "absolute",
    top: 0,
    right: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#1a365d",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "left",
    marginBottom: 4,
  },
  section: {
    marginTop: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    padding: 8,
    marginBottom: 12,
    textAlign: "center",
    backgroundColor: "#f0f6ff",
    color: "#1a365d",
    minPresenceAhead: 50,
  },
  questionBlock: {
    marginBottom: 15,
    paddingLeft: 10,
  },
  questionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#2d3748",
  },
  questionEnunciado: {
    fontSize: 10,
    marginBottom: 4,
    color: "#4a5568",
  },
  answerText: {
    paddingLeft: 8,
    fontSize: 10,
    color: "#4a5568",
  },
  table: {
    marginTop: 6,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4a5568",
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
  },
  tableCell: {
    fontSize: 8,
    textAlign: "center",
    flex: 1,
    color: "#4a5568",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 50,
    fontSize: 9,
    color: "#666",
  },
  footerText: {
    position: "absolute",
    bottom: 35,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
});

const formatDuracion = (d: string) => {
  switch (d) {
    case "anual":
      return "Anual";
    case "cuatrimestre_1":
      return "Primer cuatrimestre";
    case "cuatrimestre_2":
      return "Segundo cuatrimestre";
    default:
      return d;
  }
};

export default function InformeSinteticoPDFDocument({
  informeId,
  titulo,
  cabecera,
  respuestas,
}: InformeSinteticoPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header} fixed>
          <Text style={styles.title}>
            {titulo || `Informe Sintético ${cabecera.anio}`}
          </Text>
          <Image src={Logo} style={styles.headerImage} />
          <Text style={styles.subtitle}>
            Departamento ID: {cabecera.departamentoId} – Carrera ID:{" "}
            {cabecera.carreraId}
          </Text>
          <Text style={styles.subtitle}>Sede: {cabecera.sede}</Text>
          <Text style={styles.subtitle}>
            Año: {cabecera.anio} – Duración: {formatDuracion(cabecera.duracion)}
          </Text>
          <Text style={styles.subtitle}>Informe N.º {informeId}</Text>
        </View>

        {/* RESPUESTAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de respuestas</Text>

          {respuestas.map((r) => {
            const tituloPregunta = r.codigo
              ? `${r.codigo}.`
              : `Pregunta ${r.preguntaId}`;

            if (r.tipo === "tabla" && r.tabla && r.tabla.length > 0) {
              const firstRow = r.tabla[0];
              const columnas = Object.keys(firstRow || {});

              return (
                <View key={r.preguntaId} style={styles.questionBlock} wrap={false}>
                  <Text style={styles.questionTitle}>{tituloPregunta}</Text>
                  <Text style={styles.questionEnunciado}>{r.enunciado}</Text>

                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      {columnas.map((col) => (
                        <Text key={col} style={styles.tableHeaderCell}>
                          {col}
                        </Text>
                      ))}
                    </View>
                    {r.tabla.map((fila, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        {columnas.map((col) => (
                          <Text key={col} style={styles.tableCell}>
                            {fila[col] ?? "-"}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            // texto
            return (
              <View key={r.preguntaId} style={styles.questionBlock}>
                <Text style={styles.questionTitle}>{tituloPregunta}</Text>
                <Text style={styles.questionEnunciado}>{r.enunciado}</Text>
                <Text style={styles.answerText}>
                  {r.texto && r.texto.trim() !== ""
                    ? r.texto
                    : "(Sin respuesta)"}
                </Text>
              </View>
            );
          })}
        </View>

        {/* FOOTER */}
        <View fixed style={styles.footerContainer}>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
          <Text style={styles.footerText}>
            Sistema de Reportes Académicos - Universidad Nacional de la
            Patagonia San Juan Bosco
          </Text>
        </View>
      </Page>
    </Document>
  );
}
