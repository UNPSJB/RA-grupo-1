import { useState } from 'react';
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
  ListGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSecretaria } from '../hooks/useSecretaria';
import '../styles/CrearEncuesta.css';

export const CrearEncuesta = () => {
  const { preguntas, categorias, crearEncuesta, crearPregunta } = useSecretaria();
  const navigate = useNavigate();
  
  // Formulario de encuesta
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    rolDestinatario: 'alumno'
  });

  // Selección de preguntas
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<number[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  // Preguntas abiertas
  const [nuevaPreguntaAbierta, setNuevaPreguntaAbierta] = useState('');
  const [categoriaAbierta, setCategoriaAbierta] = useState<number | null>(null);

  // Preguntas cerradas
  const [nuevaPreguntaCerrada, setNuevaPreguntaCerrada] = useState('');
  const [categoriaCerrada, setCategoriaCerrada] = useState<number | null>(null);
  const [opcionesTexto, setOpcionesTexto] = useState<string[]>([]);
  const [nuevaOpcionTexto, setNuevaOpcionTexto] = useState('');

  // Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Agrupar preguntas
  const preguntasAgrupadas = categorias.map(categoria => ({
    ...categoria,
    preguntas: preguntas.filter(p => p.categoriaId === categoria.id)
  }));

  const togglePregunta = (id: number) => {
    setPreguntasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleCategoria = (categoriaId: number) => {
    const categoria = preguntasAgrupadas.find(c => c.id === categoriaId);
    if (!categoria) return;

    if (categoriasSeleccionadas.includes(categoriaId)) {
      setCategoriasSeleccionadas(prev => prev.filter(id => id !== categoriaId));
      setPreguntasSeleccionadas(prev => prev.filter(id => !categoria.preguntas.some(p => p.id === id)));
    } else {
      setCategoriasSeleccionadas(prev => [...prev, categoriaId]);
      setPreguntasSeleccionadas(prev => [...prev, ...categoria.preguntas.map(p => p.id)]);
    }
  };

  // Crear pregunta abierta
  const crearPreguntaAbiertaHandler = async () => {
    if (!nuevaPreguntaAbierta.trim()) {
      setError("El texto de la pregunta no puede estar vacío");
      return;
    }

    if (!categoriaAbierta) {
      setError("Debes seleccionar una categoría");
      return;
    }

    try {
      await crearPregunta(nuevaPreguntaAbierta, "abierta", undefined, categoriaAbierta);
      setNuevaPreguntaAbierta("");
      setCategoriaAbierta(null);
      setSuccess("✅ Pregunta abierta creada");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al crear pregunta abierta");
      console.error(err);
    }
  };

  // Agregar opción a la lista temporal
  const agregarOpcion = () => {
    if (!nuevaOpcionTexto.trim()) {
      setError("El texto de la opción no puede estar vacío");
      return;
    }
    
    if (opcionesTexto.includes(nuevaOpcionTexto.trim())) {
      setError("Esta opción ya existe");
      return;
    }

    setOpcionesTexto(prev => [...prev, nuevaOpcionTexto.trim()]);
    setNuevaOpcionTexto('');
  };

  // Eliminar opción de la lista temporal
  const eliminarOpcion = (texto: string) => {
    setOpcionesTexto(prev => prev.filter(op => op !== texto));
  };

  // Crear pregunta cerrada
  const crearPreguntaCerradaHandler = async () => {
    if (!nuevaPreguntaCerrada.trim()) {
      setError("El texto de la pregunta no puede estar vacío");
      return;
    }

    if (!categoriaCerrada) {
      setError("Debes seleccionar una categoría");
      return;
    }
    
    if (opcionesTexto.length < 2) {
      setError("Debes agregar al menos 2 opciones");
      return;
    }

    try {
      await crearPregunta(nuevaPreguntaCerrada, "opcion_multiple", opcionesTexto, categoriaCerrada);
      
      setNuevaPreguntaCerrada("");
      setCategoriaCerrada(null);
      setOpcionesTexto([]);
      setSuccess("✅ Pregunta cerrada creada");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al crear pregunta cerrada");
      console.error(err);
    }
  };

  // Crear encuesta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }
    
    if (preguntasSeleccionadas.length === 0) {
      setError("Selecciona al menos una pregunta");
      return;
    }

    try {
      await crearEncuesta(
        formData.titulo, 
        formData.descripcion, 
        formData.rolDestinatario, 
        preguntasSeleccionadas
      );
      navigate("/secretaria");
    } catch (err) {
      setError("Error al crear la encuesta");
      console.error(err);
    }
  };

  return (
    <Container fluid className="py-4">

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

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
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Encuesta de Satisfacción 2025"
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

              </Card.Body>
            </Card>

            {/* Pregunta abierta */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">📝 Agregar Pregunta Abierta</h5>
              </Card.Header>
              <Card.Body>
                
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    value={categoriaAbierta || ''}
                    onChange={(e) => setCategoriaAbierta(Number(e.target.value) || null)}
                  >
                    <option value="">Selecciona una categoría...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.codigo} - {cat.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                  <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Ej: ¿Qué aspectos del curso te parecieron más útiles y cuáles crees que podrían mejorarse?"
                  />
                </Form.Group>
                
                <Row className="mt-2">
                  <Col md={12}>
                    <Button 
                      className="w-100" 
                      variant="success"
                      onClick={crearPreguntaAbiertaHandler}
                      disabled={!nuevaPreguntaAbierta.trim() || !categoriaAbierta}
                    >
                      ✓ Agregar Pregunta Abierta
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Pregunta cerrada */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">☑️ Agregar Pregunta Cerrada</h5>
              </Card.Header>
              <Card.Body>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    value={categoriaCerrada || ''}
                    onChange={(e) => setCategoriaCerrada(Number(e.target.value) || null)}
                  >
                    <option value="">Selecciona una categoría...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.codigo} - {cat.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Control
                  className="mb-3"
                  placeholder="Ej: ¿Cómo calificarías la explicación del docente?"
                  value={nuevaPreguntaCerrada}
                  onChange={(e) => setNuevaPreguntaCerrada(e.target.value)}
                />

                {/* Lista de opciones agregadas */}
                {opcionesTexto.length > 0 && (
                  <div className="mb-3">
                    <div className="text-muted mb-2">
                      <strong>Opciones agregadas ({opcionesTexto.length}):</strong>
                    </div>
                    <ListGroup>
                      {opcionesTexto.map((opcion, index) => (
                        <ListGroup.Item 
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span>
                            <Badge bg="secondary" className="me-2">{index + 1}</Badge>
                            {opcion}
                          </span>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => eliminarOpcion(opcion)}
                          >
                            ✕
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}

                {/* Agregar nueva opción */}
                <Row className="mb-3">
                  <Col md={9}>
                    <Form.Control
                      placeholder="Escribe una opción de respuesta..."
                      value={nuevaOpcionTexto}
                      onChange={(e) => setNuevaOpcionTexto(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          agregarOpcion();
                        }
                      }}
                    />
                  </Col>
                  <Col md={3}>
                    <Button
                      className="w-100"
                      variant="outline-secondary"
                      onClick={agregarOpcion}
                      disabled={!nuevaOpcionTexto.trim()}
                    >
                      + Opción
                    </Button>
                  </Col>
                </Row>

                <Button 
                  className="w-100" 
                  variant="info" 
                  onClick={crearPreguntaCerradaHandler}
                  disabled={!nuevaPreguntaCerrada.trim() || !categoriaCerrada || opcionesTexto.length < 2}
                >
                  Agregar Pregunta Cerrada
                </Button>

              </Card.Body>
            </Card>

          </Col>

          {/* Derecha */}
          <Col md={4}>
            <Card className="shadow-sm sticky-summary">
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">📊 Resumen</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Categorías seleccionadas:</strong> 
                  <Badge bg="primary" className="ms-2">{categoriasSeleccionadas.length}</Badge>
                </div>
                <div className="mb-3">
                  <strong>Preguntas seleccionadas:</strong> 
                  <Badge bg="success" className="ms-2">{preguntasSeleccionadas.length}</Badge>
                </div>
                
                <hr />
                
                <div className="mb-3">
                  <small className="text-muted">
                    {formData.titulo ? (
                      <>✓ Título definido</>
                    ) : (
                      <>⚠️ Falta título</>
                    )}
                  </small>
                </div>

                <Button 
                  type="submit" 
                  className="w-100"
                  variant="primary"
                  size="lg"
                  disabled={!formData.titulo.trim() || preguntasSeleccionadas.length === 0}
                >
                  🚀 Crear Encuesta
                </Button>
              </Card.Body>
            </Card>

            {/* Leyenda de categorías */}
            <Card className="shadow-sm mt-3">
              <Card.Header>
                <h6 className="mb-0">📚 Categorías Disponibles</h6>
              </Card.Header>
              <Card.Body className="p-2">
                <ListGroup variant="flush">
                  {categorias.map(cat => (
                    <ListGroup.Item key={cat.id} className="py-1 px-2">
                      <Badge bg="secondary" className="me-2">{cat.codigo}</Badge>
                      <small>{cat.nombre}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Form>

      {/* Selector de preguntas */}
      <Card className="mt-5 shadow-sm">
        <Card.Header className="bg-light">
          <h5>✅ Seleccionar Preguntas Existentes</h5>
          <small className="text-muted">Agrupadas por categorías</small>
        </Card.Header>
        <Card.Body>

          {preguntasAgrupadas.length === 0 ? (
            <Alert variant="info">
              No hay preguntas disponibles. Crea preguntas usando los formularios de arriba.
            </Alert>
          ) : (
            <Accordion alwaysOpen>
              {preguntasAgrupadas.map(categoria => (
                <Accordion.Item key={categoria.id} eventKey={categoria.id.toString()}>
                  <Accordion.Header>
                    <Form.Check
                      type="checkbox"
                      className="me-3"
                      checked={categoriasSeleccionadas.includes(categoria.id)}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleCategoria(categoria.id); 
                      }}
                      onChange={() => {}}
                    />
                    <Badge bg="secondary" className="me-2">{categoria.codigo}</Badge>
                    <strong>{categoria.nombre}</strong>
                    <Badge bg="primary" className="ms-2">{categoria.preguntas.length}</Badge>
                  </Accordion.Header>

                  <Accordion.Body>
                    {categoria.preguntas.length === 0 ? (
                      <p className="text-muted">No hay preguntas en esta categoría</p>
                    ) : (
                      <Row>
                        {categoria.preguntas.map(p => (
                          <Col md={6} key={p.id} className="mb-3">
                            <Card 
                              className={`p-3 card-pregunta ${preguntasSeleccionadas.includes(p.id) ? "border-primary border-2" : ""}`}
                              onClick={() => togglePregunta(p.id)}
                              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                              <div className="d-flex align-items-start">
                                <Form.Check 
                                  checked={preguntasSeleccionadas.includes(p.id)} 
                                  readOnly 
                                  className="me-2"
                                />
                                <div>
                                  <Badge bg={p.tipo === 'abierta' ? 'success' : 'info'} className="mb-2">
                                    {p.tipo === 'abierta' ? '📝 Abierta' : '☑️ Cerrada'}
                                  </Badge>
                                  <div>{p.texto}</div>
                                </div>
                              </div>
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

    </Container>
  );
};