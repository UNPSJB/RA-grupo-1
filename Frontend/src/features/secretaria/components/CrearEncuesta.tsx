import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Badge, 
  Accordion,
  Modal 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSecretaria } from '../hooks/useSecretaria';
import { Pregunta } from '../types/encuestasTypes';
import { Ciclo } from '../../ciclos/types/ciclosTypes';

export const CrearEncuesta = () => {
  const { preguntas, categorias, crearEncuesta, crearPregunta, eliminarPregunta } = useSecretaria();
  const navigate = useNavigate();
  
  // Estados del formulario principal
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    rolDestinatario: 'alumno'
  });
  
  // Estados de selección
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<number[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  
  // Estados de ciclos
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [cicloSeleccionado, setCicloSeleccionado] = useState<Ciclo | null>(null);
  const [loadingCiclos, setLoadingCiclos] = useState(true);
  
  // Estados de gestión de preguntas
  const [nuevaPreguntaAbierta, setNuevaPreguntaAbierta] = useState('');
  const [creandoPregunta, setCreandoPregunta] = useState(false);
  
  // Estados para eliminación
  const [preguntaAEliminar, setPreguntaAEliminar] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Estados de feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar ciclos disponibles
  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        setLoadingCiclos(true);
        const response = await fetch('http://127.0.0.1:8000/ciclos');
        if (!response.ok) {
          throw new Error('Error al cargar los ciclos');
        }
        const data = await response.json();
        setCiclos(data);
        
        // Seleccionar automáticamente el primer ciclo activo
        const cicloActivo = data.find((ciclo: Ciclo) => ciclo.activo);
        if (cicloActivo) {
          setCicloSeleccionado(cicloActivo);
        }
      } catch (err) {
        console.error('Error fetching ciclos:', err);
        setError('No se pudieron cargar los ciclos disponibles');
      } finally {
        setLoadingCiclos(false);
      }
    };

    fetchCiclos();
  }, []);

  // Agrupar preguntas por categoría
  const preguntasAgrupadas = categorias.map(categoria => ({
    ...categoria,
    preguntas: preguntas.filter(p => p.categoriaId === categoria.id)
  }));

  // Manejo de selección de preguntas
  const togglePregunta = (preguntaId: number) => {
    setPreguntasSeleccionadas(prev => 
      prev.includes(preguntaId)
        ? prev.filter(id => id !== preguntaId)
        : [...prev, preguntaId]
    );
  };

  const getPreguntaSeleccionada = (preguntaId: number) => {
    return preguntasSeleccionadas.includes(preguntaId);
  };

  // Manejo de selección de categorías
  const toggleCategoria = (categoriaId: number) => {
    const categoria = preguntasAgrupadas.find(c => c.id === categoriaId);
    if (!categoria) return;

    if (categoriasSeleccionadas.includes(categoriaId)) {
      // Deseleccionar categoría y todas sus preguntas
      setCategoriasSeleccionadas(prev => prev.filter(id => id !== categoriaId));
      const idsPreguntasCategoria = categoria.preguntas.map(p => p.id);
      setPreguntasSeleccionadas(prev => prev.filter(id => !idsPreguntasCategoria.includes(id)));
    } else {
      // Seleccionar categoría y todas sus preguntas
      setCategoriasSeleccionadas(prev => [...prev, categoriaId]);
      const idsPreguntasCategoria = categoria.preguntas.map(p => p.id);
      setPreguntasSeleccionadas(prev => [...prev, ...idsPreguntasCategoria]);
    }
  };

  const getCategoriaSeleccionada = (categoriaId: number) => {
    return categoriasSeleccionadas.includes(categoriaId);
  };

  // Manejo de ciclos
  const handleCicloChange = (cicloId: number) => {
    const ciclo = ciclos.find(c => c.id === cicloId);
    setCicloSeleccionado(ciclo || null);
  };

  // Crear nueva pregunta abierta
  const crearPreguntaAbiertaHandler = async () => {
    if (!nuevaPreguntaAbierta.trim()) {
      setError('El texto de la pregunta no puede estar vacío');
      return;
    }

    try {
      setCreandoPregunta(true);
      const preguntaCreada = await crearPregunta(
        nuevaPreguntaAbierta, 
        'abierta', 
        undefined, 
        7 // Categoría G - Sugerencias
      );
      
      setNuevaPreguntaAbierta('');
      setSuccess('Pregunta abierta creada exitosamente');
    } catch (err) {
      setError('Error al crear la pregunta');
    } finally {
      setCreandoPregunta(false);
    }
  };

  // Manejo de eliminación de preguntas
  const handleEliminarPregunta = (preguntaId: number) => {
    setPreguntaAEliminar(preguntaId);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    if (preguntaAEliminar) {
      try {
        await eliminarPregunta(preguntaAEliminar);
        
        // Remover de seleccionadas si estaba seleccionada
        if (preguntasSeleccionadas.includes(preguntaAEliminar)) {
          setPreguntasSeleccionadas(prev => prev.filter(id => id !== preguntaAEliminar));
        }
        
        setSuccess('Pregunta eliminada exitosamente');
      } catch (err) {
        setError('Error al eliminar la pregunta');
      } finally {
        setShowConfirmDelete(false);
        setPreguntaAEliminar(null);
      }
    }
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (preguntasSeleccionadas.length === 0) {
      setError('Selecciona al menos una pregunta');
      return;
    }

    if (!formData.titulo) {
      setError('El título de la encuesta es obligatorio');
      return;
    }

    if (!cicloSeleccionado) {
      setError('Debes seleccionar un ciclo para la encuesta');
      return;
    }

    if (!cicloSeleccionado.fecha_inicio || !cicloSeleccionado.fecha_fin) {
      setError('El ciclo seleccionado no tiene fechas configuradas');
      return;
    }

    try {
      const preguntasParaEncuesta = preguntas.filter(p => 
        preguntasSeleccionadas.includes(p.id)
      ).map((p, index) => ({
        ...p,
        orden: index + 1
      }));

      const categoriasParaEncuesta = categorias.filter(c =>
        categoriasSeleccionadas.includes(c.id)
      );

      await crearEncuesta({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categorias: categoriasParaEncuesta,
        preguntas: preguntasParaEncuesta,
        activa: true,
        fechaInicio: cicloSeleccionado.fecha_inicio,
        fechaFin: cicloSeleccionado.fecha_fin,
        rolDestinatario: formData.rolDestinatario
      });

      navigate('/secretaria');
    } catch (err) {
      setError('Error al crear la encuesta');
      console.error('Error:', err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1 className="h2">Crear Nueva Encuesta</h1>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            {/* Información de la Encuesta */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Información de la Encuesta</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Título de la Encuesta *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Encuesta de Satisfacción Docente - Primer Semestre 2025"
                    required
                  />
                </Form.Group>

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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Seleccionar Ciclo *</Form.Label>
                      {loadingCiclos ? (
                        <div className="text-muted">Cargando ciclos...</div>
                      ) : ciclos.length === 0 ? (
                        <Alert variant="warning" className="mb-0">
                          No hay ciclos disponibles. Primero crea un ciclo en la sección de Gestión de Ciclos.
                        </Alert>
                      ) : (
                        <Form.Select
                          value={cicloSeleccionado?.id || ''}
                          onChange={(e) => handleCicloChange(Number(e.target.value))}
                          required
                        >
                          <option value="">Selecciona un ciclo...</option>
                          {ciclos.map((ciclo) => (
                            <option key={ciclo.id} value={ciclo.id}>
                              {ciclo.nombre} 
                              {ciclo.activo && ' ✅'} 
                              {ciclo.fecha_inicio && ciclo.fecha_fin && 
                                ` (${new Date(ciclo.fecha_inicio).toLocaleDateString()} - ${new Date(ciclo.fecha_fin).toLocaleDateString()})`
                              }
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destinatario</Form.Label>
                      <Form.Select
                        value={formData.rolDestinatario}
                        onChange={(e) => setFormData({ ...formData, rolDestinatario: e.target.value })}
                      >
                        <option value="alumno">Alumnos</option>
                        <option value="docente">Docentes</option>
                        <option value="todos">Todos</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Información del ciclo seleccionado */}
                {cicloSeleccionado && (
                  <Card className="mt-3 border-info">
                    <Card.Body className="py-2">
                      <Row>
                        <Col md={6}>
                          <small className="text-muted">Ciclo seleccionado:</small>
                          <div>
                            <strong>{cicloSeleccionado.nombre}</strong>
                            {cicloSeleccionado.activo && (
                              <Badge bg="success" className="ms-2">Activo</Badge>
                            )}
                          </div>
                        </Col>
                        <Col md={3}>
                          <small className="text-muted">Inicio:</small>
                          <div>
                            {cicloSeleccionado.fecha_inicio ? (
                              <strong>{new Date(cicloSeleccionado.fecha_inicio).toLocaleDateString()}</strong>
                            ) : (
                              <span className="text-warning">No configurado</span>
                            )}
                          </div>
                        </Col>
                        <Col md={3}>
                          <small className="text-muted">Fin:</small>
                          <div>
                            {cicloSeleccionado.fecha_fin ? (
                              <strong>{new Date(cicloSeleccionado.fecha_fin).toLocaleDateString()}</strong>
                            ) : (
                              <span className="text-warning">No configurado</span>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>

            {/* Crear Nueva Pregunta Abierta */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Crear Nueva Pregunta Abierta</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Texto de la pregunta *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingresa el texto de la pregunta..."
                    value={nuevaPreguntaAbierta}
                    onChange={(e) => setNuevaPreguntaAbierta(e.target.value)}
                  />
                </Form.Group>
                <Button 
                  variant="outline-primary"
                  onClick={crearPreguntaAbiertaHandler}
                  disabled={!nuevaPreguntaAbierta.trim() || creandoPregunta}
                >
                  {creandoPregunta ? 'Creando...' : 'Crear Pregunta Abierta'}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Panel de Resumen */}
          <Col md={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Resumen</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Ciclo:</strong>{' '}
                  {cicloSeleccionado ? (
                    <Badge bg="info">{cicloSeleccionado.nombre}</Badge>
                  ) : (
                    <span className="text-muted">No seleccionado</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong>Categorías seleccionadas:</strong>{' '}
                  <Badge bg="primary">{categoriasSeleccionadas.length}</Badge>
                </div>
                <div className="mb-3">
                  <strong>Preguntas seleccionadas:</strong>{' '}
                  <Badge bg="success">{preguntasSeleccionadas.length}</Badge>
                </div>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={preguntasSeleccionadas.length === 0 || !cicloSeleccionado}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Crear Encuesta
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Selección de Preguntas por Categoría */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Seleccionar Preguntas por Categoría</h5>
                <small className="text-muted">
                  Organiza las preguntas por categorías temáticas del sistema universitario
                </small>
              </Card.Header>
              <Card.Body>
                {preguntas.length === 0 ? (
                  <Alert variant="info">
                    No hay preguntas disponibles. Primero crea algunas preguntas en la sección de Gestión de Preguntas.
                  </Alert>
                ) : (
                  <Accordion>
                    {preguntasAgrupadas.map((categoria) => (
                      <Accordion.Item key={categoria.id} eventKey={categoria.id.toString()}>
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="checkbox"
                              checked={getCategoriaSeleccionada(categoria.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleCategoria(categoria.id);
                              }}
                              className="me-3"
                            />
                            <strong>{categoria.codigo}: {categoria.nombre}</strong>
                            <Badge bg="secondary" className="ms-2">
                              {categoria.preguntas.length} preguntas
                            </Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {categoria.preguntas.length === 0 ? (
                            <Alert variant="info" className="mb-0">
                              No hay preguntas en esta categoría
                            </Alert>
                          ) : (
                            <Row>
                              {categoria.preguntas.map((pregunta) => (
                                <Col key={pregunta.id} md={6} className="mb-3">
                                  <Card 
                                    className={`h-100 cursor-pointer ${
                                      getPreguntaSeleccionada(pregunta.id) ? 'border-primary' : ''
                                    }`}
                                    onClick={() => togglePregunta(pregunta.id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Card.Body>
                                      <div className="d-flex align-items-start">
                                        <Form.Check
                                          type="checkbox"
                                          checked={getPreguntaSeleccionada(pregunta.id)}
                                          onChange={() => togglePregunta(pregunta.id)}
                                          className="me-2 mt-1"
                                        />
                                        <div className="flex-grow-1">
                                          <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                              <Badge 
                                                bg={pregunta.tipo === 'abierta' ? 'primary' : 'success'} 
                                                className="mb-1"
                                              >
                                                {pregunta.tipo === 'abierta' ? 'Abierta' : 'Cerrada'}
                                              </Badge>
                                              <Badge bg="secondary" className="ms-1">
                                                Orden: {pregunta.orden}
                                              </Badge>
                                            </div>
                                            <Button
                                              variant="outline-danger"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarPregunta(pregunta.id);
                                              }}
                                              title="Eliminar pregunta"
                                            >
                                              <i className="bi bi-trash"></i>
                                            </Button>
                                          </div>
                                          <p className="mb-2">{pregunta.texto}</p>
                                          {pregunta.tipo === 'cerrada' && pregunta.opciones && (
                                            <small className="text-muted">
                                              <strong>Opciones:</strong> {pregunta.opciones.join(', ')}
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar esta pregunta? 
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};