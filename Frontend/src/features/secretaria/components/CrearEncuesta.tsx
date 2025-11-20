import { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Badge
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSecretaria } from '../hooks/useSecretaria';

export const CrearEncuesta = () => {
  const { crearEncuesta } = useSecretaria();
  const navigate = useNavigate();
  
  // Formulario de encuesta
  const [formData, setFormData] = useState({
    descripcion: '',
    plantillaBase: 'encuesta_alumno'
  });

  // Selección de preguntas
  const [preguntasSeleccionadas] = useState<number[]>([]);

  // Feedback
  const [error, setError] = useState<string | null>(null);

  // Crear encuesta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (preguntasSeleccionadas.length === 0) {
      setError("Selecciona al menos una pregunta");
      return;
    }

    try {
      await crearEncuesta(
        formData.plantillaBase, 
        formData.descripcion, 
        formData.plantillaBase, 
        preguntasSeleccionadas
      );
      navigate("/secretaria");
    } catch (err) {
      setError("Error al crear la encuesta");
      console.error(err);
    }
  };

  const irANuevaEncuesta = () => {
    navigate("/secretaria/nueva-encuesta");
  };

  return (
    <Container fluid className="py-4">

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>

          {/* Izquierda */}
          <Col md={8}>

            {/* Información */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">📋 Información de la Encuesta</h5>
              </Card.Header>
              <Card.Body>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Describe el propósito de esta encuesta..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Plantilla base</Form.Label>
                  <Form.Select
                    value={formData.plantillaBase}
                    onChange={(e) => setFormData({ ...formData, plantillaBase: e.target.value })}
                  >
                    <option value="encuesta_alumno">Encuesta Alumno</option>
                    <option value="informe_sintetico">Informe Sintético</option>
                    <option value="informe_catedra">Informe Cátedra</option>
                  </Form.Select>
                </Form.Group>

                <Button 
                  variant="success" 
                  size="lg"
                  className="w-100"
                  onClick={irANuevaEncuesta}
                >
                  + Crear nueva encuesta
                </Button>

              </Card.Body>
            </Card>

          </Col>

          {/* Derecha */}
          <Col md={4}>
            <Card className="shadow-sm sticky-summary">
              <Card.Body>
                <div className="mb-3">
                  <strong>Preguntas seleccionadas:</strong> 
                  <Badge bg="success" className="ms-2">{preguntasSeleccionadas.length}</Badge>
                </div>
                
                <hr />

                <Button 
                  type="submit" 
                  className="w-100"
                  variant="primary"
                  size="lg"
                  disabled={preguntasSeleccionadas.length === 0}
                >
                  Guardar Encuesta
                </Button>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Form>

    </Container>
  );
};