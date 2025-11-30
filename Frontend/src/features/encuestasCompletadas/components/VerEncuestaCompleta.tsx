import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import api from "../../../services/api";

interface RespuestaDetalle {
  pregunta_id: number;
  pregunta: string;
  respuesta_texto?: string | null;
  opcion_id?: number | null;
  opcion_texto?: string | null;
}

interface DetalleEncuestaFinalizada {
  id_finalizada: number;
  encuesta_id: number;
  asignatura_id: number;
  titulo: string;
  anio: number;
  duracion: string;
  ciclo_lectivo: string;
  asignatura: string;
  sede_id: number | null;
  docente: string;
  respuestas: RespuestaDetalle[];
}

export default function VerEncuestaCompleta() {
  const { id } = useParams<{ id: string }>();
  const [detalle, setDetalle] = useState<DetalleEncuestaFinalizada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usa tu instancia axios con baseURL
        const res = await api.get<DetalleEncuestaFinalizada>(
          `/encuestas/finalizadas/${id}`
        );

        setDetalle(res.data);
      } catch (err: any) {
        console.error("Error cargando encuesta finalizada:", err);
        setError("No se pudo cargar la encuesta finalizada");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Cargando encuesta...</p>
      </Container>
    );
  }

  if (error || !detalle) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error || "No se encontraron datos de la encuesta finalizada."}
        </Alert>
        <Link to="/alumno/completadas">
          <Button variant="secondary" className="mt-2">
            Volver al listado
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Encuesta completada: {detalle.titulo}</h2>

      <Card className="mb-4">
        <Card.Body>
          <p><strong>Año:</strong> {detalle.anio}</p>
          <p><strong>Ciclo lectivo:</strong> {detalle.ciclo_lectivo}</p>
          <p><strong>Asignatura:</strong> {detalle.asignatura}</p>
          <p><strong>Sede:</strong> {detalle.sede_id ?? "Sin sede"}</p>
          <p><strong>Docente:</strong> {detalle.docente}</p>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Preguntas y respuestas</h4>

      {detalle.respuestas.length === 0 ? (
        <Alert variant="info">No se encontraron respuestas registradas.</Alert>
      ) : (
        detalle.respuestas.map((r) => (
          <Card className="mb-3" key={r.pregunta_id}>
            <Card.Body>
              <p className="fw-bold">{r.pregunta}</p>

              {r.respuesta_texto && (
                <p>
                  <strong>Respuesta:</strong> {r.respuesta_texto}
                </p>
              )}

              {r.opcion_texto && (
                <p>
                  <strong>Opción seleccionada:</strong> {r.opcion_texto}
                </p>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Link to="/alumno/completadas">
        <Button variant="secondary">Volver al listado</Button>
      </Link>
    </Container>
  );
}
