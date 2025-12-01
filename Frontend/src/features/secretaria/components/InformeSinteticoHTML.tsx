import React from "react";
import {
  CabeceraPDF,
  RespuestaPDF,
} from "../../departamentos/components/InformeSinteticoPDFDocument";

interface InformeSinteticoHTMLProps {
  titulo: string;
  cabecera: CabeceraPDF;
  respuestas: RespuestaPDF[];
}

// Formateo correcto de duración
function formatDuracion(d: string) {
  switch (d.toLowerCase()) {
    case "anual":
      return "Anual";
    case "primer_cuatrimestre":
      return "1er Cuatrimestre";
    case "segundo_cuatrimestre":
      return "2do Cuatrimestre";
    default:
      return d;
  }
}

const InformeSinteticoHTML: React.FC<InformeSinteticoHTMLProps> = ({
  titulo,
  cabecera,
  respuestas,
}) => {
  return (
    <div className="container mb-5">
      <h2 className="text-center mb-4">{titulo}</h2>

      {/* CABECERA COMPACTA */}
      <div
        className="p-3 mb-4 border rounded bg-light"
        style={{ fontSize: "14px" }}
      >
        <div className="row">
          <div className="col-6">
            <p className="mb-1">
              <strong>Departamento:</strong> {cabecera.departamentoNombre}
            </p>
            <p className="mb-1">
              <strong>Carrera:</strong> {cabecera.carreraNombre}
            </p>
            <p className="mb-1">
              <strong>Sede:</strong> {cabecera.sede}
            </p>
          </div>
          <div className="col-6">
            <p className="mb-1">
              <strong>Año:</strong> {cabecera.anio}
            </p>
            <p className="mb-1">
              <strong>Ciclo Lectivo:</strong> {formatDuracion(cabecera.duracion)}
            </p>
          </div>
        </div>
      </div>

      <h4
        className="text-center p-2 mb-4 rounded"
        style={{
          backgroundColor: "#f0f6ff",
          color: "#1a365d",
          fontWeight: "bold",
        }}
      >
        Detalle de respuestas
      </h4>

      {respuestas.map((r, idx) => {
        const tituloPregunta = r.codigo
          ? `${r.codigo}.`
          : `Pregunta ${r.preguntaId}`;

        // RESPUESTA TABLA
        if (r.tipo === "tabla" && r.tabla && r.tabla.length > 0) {
          const columnas = Object.keys(r.tabla[0] || {});

          return (
            <div key={idx} className="mb-4">
              <h6 className="fw-bold">{tituloPregunta}</h6>
              <p className="text-muted">{r.enunciado}</p>

              <table className="table table-bordered">
                <thead
                  style={{
                    backgroundColor: "#4a5568",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <tr>
                    {columnas.map((col) => (
                      <th key={col} className="text-center">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.tabla.map((fila, i) => (
                    <tr key={i}>
                      {columnas.map((col) => (
                        <td key={col} className="text-center">
                          {fila[col] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // RESPUESTA TEXTO
        return (
          <div key={idx} className="mb-4">
            <h6 className="fw-bold">{tituloPregunta}</h6>
            <p className="text-muted">{r.enunciado}</p>
            <p className="ps-2">
              {r.texto && r.texto.trim() !== "" ? r.texto : "(Sin respuesta)"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default InformeSinteticoHTML;
