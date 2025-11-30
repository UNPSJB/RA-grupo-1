import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Spinner, Alert, Button, ListGroup } from "react-bootstrap";

const API = "http://127.0.0.1:8000";

// Ajustá los nombres de campos a lo que realmente devuelva tu endpoint
interface RespuestaDetalle {
  pregunta_id: number;
  pregunta: string;
  respuesta_texto: string | null;
  opcion_texto: string | null;
}

interface DetalleEncuesta {
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
  fecha_finalizada?: string;
  respuestas: RespuestaDetalle[];
}

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const EncuestaCompletadaDetalle = () => {
  const { id_finalizada } = useParams<{ id_finalizada: string }>();

  const [detalle, setDetalle] = useState<DetalleEncuesta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(
          `${API}/encuestas/finalizadas/${id_finalizada}`
        );

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(
            errData.detail || `Error ${resp.status}: ${resp.statusText}`
          );
        }

        const data = await resp.json();
        setDetalle(data);
      } catch (e: any) {
        console.error("❌ Error detalle encuesta:", e);
        setError(e.message || "Error al cargar la encuesta");
      } finally {
        setLoading(false);
      }
    };

    if (id_finalizada) {
      fetchDetalle();
    }
  }, [id_finalizada]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !detalle) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar la encuesta</Alert.Heading>
          <p className="mb-3">{error ?? "Encuesta no encontrada"}</p>
            <Link to="/alumno/completadas">
            <Button variant="secondary">
                Volver al listado
            </Button>
            </Link>

        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{detalle.titulo || "Encuesta completada"}</h2>
        <Link to="/alumno/completadas">
        <Button variant="secondary" size="sm">
            Volver al listado
        </Button>
        </Link> 
      </div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{detalle.asignatura}</Card.Title>
          <div className="encuesta-details">
            <p className="mb-1">
              <strong>Año:</strong> {detalle.anio}
            </p>
            <p className="mb-1">
              <strong>Ciclo lectivo:</strong> {detalle.ciclo_lectivo}
            </p>
            <p className="mb-1">
              <strong>Sede:</strong> {detalle.sede_id ?? "Sin sede"}
            </p>
            <p className="mb-1">
              <strong>Docente:</strong> {detalle.docente}
            </p>
            <p className="mb-0">
              <strong>Completada el:</strong>{" "}
              {formatearFecha(detalle.fecha_finalizada)}
            </p>
          </div>
        </Card.Body>
      </Card>

      <h4>Preguntas y respuestas</h4>
      <ListGroup>
        {detalle.respuestas.map((r) => (
          <ListGroup.Item key={r.pregunta_id}>
            <p className="mb-1">
              <strong>{r.pregunta}</strong>
            </p>
            <p className="mb-0">
              {r.respuesta_texto ??
                r.opcion_texto ??
                "Sin respuesta registrada"}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};
