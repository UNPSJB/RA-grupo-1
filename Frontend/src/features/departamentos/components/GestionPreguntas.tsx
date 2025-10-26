import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Form, Modal, Spinner, Alert, Badge 
} from 'react-bootstrap';
import '../styles/Departamento.css';

interface Pregunta {
  id: number;
  texto: string;
  tipo: 'multiple' | 'texto' | 'escala';
  categoria: string;
  activa: boolean;
  fechaCreacion: string;
  orden: number;
}

export const GestionPreguntas = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [preguntaEditando, setPreguntaEditando] = useState<Pregunta | null>(null);

  // Estados para el formulario
  const [textoPregunta, setTextoPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState('multiple');
  const [categoriaPregunta, setCategoriaPregunta] = useState('docente');
  const [activaPregunta, setActivaPregunta] = useState(true);

  // Cargar preguntas
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos harcodeados
        const preguntasData: Pregunta[] = [
          {
            id: 1,
            texto: "¿El docente explica los conceptos con claridad?",
            tipo: 'escala',
            categoria: 'docente',
            activa: true,
            fechaCreacion: '2025-01-15',
            orden: 1
          },
          {
            id: 2,
            texto: "¿El material de estudio es adecuado?",
            tipo: 'escala',
            categoria: 'material',
            activa: true,
            fechaCreacion: '2025-01-15',
            orden: 2
          },
          {
            id: 3,
            texto: "¿Qué aspectos mejorarías del curso?",
            tipo: 'texto',
            categoria: 'sugerencias',
            activa: true,
            fechaCreacion: '2025-01-20',
            orden: 3
          },
          {
            id: 4,
            texto: "¿El ritmo de la clase es adecuado?",
            tipo: 'escala',
            categoria: 'docente',
            activa: false,
            fechaCreacion: '2025-01-10',
            orden: 4
          }
        ];
        
        setPreguntas(preguntasData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las preguntas");
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, []);

  const abrirModalNuevaPregunta = () => {
    setPreguntaEditando(null);
    setTextoPregunta('');
    setTipoPregunta('multiple');
    setCategoriaPregunta('docente');
    setActivaPregunta(true);
    setShowModal(true);
  };

  const abrirModalEditarPregunta = (pregunta: Pregunta) => {
    setPreguntaEditando(pregunta);
    setTextoPregunta(pregunta.texto);
    setTipoPregunta(pregunta.tipo);
    setCategoriaPregunta(pregunta.categoria);
    setActivaPregunta(pregunta.activa);
    setShowModal(true);
  };

  const guardarPregunta = () => {
    // Aca van los datos desde la API
    if (preguntaEditando) {
      // Editar pregunta existente
      setPreguntas(prev => prev.map(p => 
        p.id === preguntaEditando.id 
          ? { ...p, texto: textoPregunta, tipo: tipoPregunta as any, categoria: categoriaPregunta, activa: activaPregunta }
          : p
      ));
    } else {
      // Nueva pregunta
      const nuevaPregunta: Pregunta = {
        id: Math.max(...preguntas.map(p => p.id)) + 1,
        texto: textoPregunta,
        tipo: tipoPregunta as any,
        categoria: categoriaPregunta,
        activa: activaPregunta,
        fechaCreacion: new Date().toISOString().split('T')[0],
        orden: preguntas.length + 1
      };
      setPreguntas(prev => [...prev, nuevaPregunta]);
    }
    
    setShowModal(false);
  };

  const toggleActivaPregunta = (id: number) => {
    setPreguntas(prev => prev.map(p => 
      p.id === id ? { ...p, activa: !p.activa } : p
    ));
  };

  const eliminarPregunta = (id: number) => {
    if (window.confirm('¿Queres eliminar esta pregunta?')) {
      setPreguntas(prev => prev.filter(p => p.id !== id));
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'escala': return 'primary';
      case 'multiple': return 'success';
      case 'texto': return 'info';
      default: return 'secondary';
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'escala': return 'Escala';
      case 'multiple': return 'Múltiple';
      case 'texto': return 'Texto';
      default: return tipo;
    }
  };

  const getCategoriaText = (categoria: string) => {
    switch (categoria) {
      case 'docente': return 'Docente';
      case 'material': return 'Material';
      case 'sugerencias': return 'Sugerencias';
      default: return categoria;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="loading-text">Cargando preguntas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>Error al cargar las preguntas</Alert.Heading>
          <p className="mb-3">{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="departamento-container">  
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Lista de Preguntas ({preguntas.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Orden</th>
                <th>Pregunta</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preguntas.map((pregunta) => (
                <tr key={pregunta.id}>
                  <td>
                    <Badge bg="secondary">{pregunta.orden}</Badge>
                  </td>
                  <td className="texto-pregunta">{pregunta.texto}</td>
                  <td>
                    <Badge bg={getTipoBadgeVariant(pregunta.tipo)}>
                      {getTipoText(pregunta.tipo)}
                    </Badge>
                  </td>
                  <td>{getCategoriaText(pregunta.categoria)}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      checked={pregunta.activa}
                      onChange={() => toggleActivaPregunta(pregunta.id)}
                      label={pregunta.activa ? 'Activa' : 'Inactiva'}
                    />
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(pregunta.fechaCreacion).toLocaleDateString('es-ES')}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => abrirModalEditarPregunta(pregunta)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarPregunta(pregunta.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar pregunta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {preguntaEditando ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Texto de la pregunta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={textoPregunta}
                onChange={(e) => setTextoPregunta(e.target.value)}
                placeholder="Escribe la pregunta aquí..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de pregunta</Form.Label>
                  <Form.Select
                    value={tipoPregunta}
                    onChange={(e) => setTipoPregunta(e.target.value)}
                  >
                    <option value="multiple">Opción múltiple</option>
                    <option value="escala">Escala numérica</option>
                    <option value="texto">Texto abierto</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={categoriaPregunta}
                    onChange={(e) => setCategoriaPregunta(e.target.value)}
                  >
                    <option value="docente">Docente</option>
                    <option value="material">Material</option>
                    <option value="metodologia">Metodología</option>
                    <option value="sugerencias">Sugerencias</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Pregunta activa"
                checked={activaPregunta}
                onChange={(e) => setActivaPregunta(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarPregunta}>
            {preguntaEditando ? 'Actualizar' : 'Crear'} Pregunta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};