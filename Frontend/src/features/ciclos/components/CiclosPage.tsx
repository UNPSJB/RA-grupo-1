import { Container, Spinner, Alert, Button } from "react-bootstrap";
import CicloCard from "./CicloCard"; 
import { useCiclos } from "../hooks/useCiclos"; 
import { Ciclo } from "../types/ciclosTypes"; 

export const CiclosPage: React.FC = () => {
  const { ciclos, loading, error, updateCicloHook, createCicloHook, fetchCiclos } = useCiclos();

  const handleUpdate = async (id: number, formData: Partial<Ciclo>) => {
    await updateCicloHook(id, formData);
  };

  const handleDuplicate = async (ciclo: Ciclo) => {
    const newCiclo: Ciclo = {
      ...ciclo,
      id: 0, // el back deberia asignar el id, se supone
      nombre: ciclo.nombre + " (Copia)",
      activo: false,
    };
    await createCicloHook(newCiclo);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar los ciclos</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchCiclos}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-3">Ciclos de Encuestas</h1>
      <p className="mb-4">En esta sección definís las fechas y habilitás los períodos de encuestas.</p>

      {ciclos.length === 0 ? (
        <Alert variant="info">
          No hay ciclos disponibles. Crea el primer ciclo.
        </Alert>
      ) : (
        ciclos.map((c) => (
          <CicloCard
            key={c.id}
            ciclo={c}
            onUpdate={handleUpdate}
            onDuplicate={handleDuplicate}
          />
        ))
      )}
    </Container>
  );
};

export default CiclosPage;