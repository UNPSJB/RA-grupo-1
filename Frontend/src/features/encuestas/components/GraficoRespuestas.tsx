import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { useDistribucion } from "../hooks/useDistribution"; 
import { Estadistica } from "../components/Estadistica";

interface Props {
  asignaturaId: number;
  preguntaId: number;
}

export default function DistribucionPage({ asignaturaId, preguntaId }: Props) {
  const { labels, data, loading, error, refetch } = useDistribucion(asignaturaId, preguntaId);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="loading-text">Cargando distribución de respuestas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar la distribución</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={refetch}>Reintentar</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Distribución de respuestas</h1>
      <Estadistica
        labels={labels}   
        title={`Pregunta ${preguntaId}`}
      />
    </Container>
  );
}
