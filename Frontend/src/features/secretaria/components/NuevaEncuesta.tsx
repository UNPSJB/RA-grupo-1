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
  ListGroup,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSecretaria } from '../hooks/useSecretaria';

export const NuevaEncuesta = () => {
  const { preguntas, categorias, crearPregunta, editarPregunta, eliminarPregunta } = useSecretaria();
  const navigate = useNavigate();
  
  // Tipo de plantilla
  const [tipoPlantilla, setTipoPlantilla] = useState<string>('');

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

  // Modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [preguntaEditando, setPreguntaEditando] = useState<any>(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [opcionesEditadas, setOpcionesEditadas] = useState<string[]>([]);
  const [nuevaOpcionEditada, setNuevaOpcionEditada] = useState('');

  // Modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preguntaAEliminar, setPreguntaAEliminar] = useState<any>(null);

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

  // Abrir modal de edición
  const abrirModalEdicion = (pregunta: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreguntaEditando(pregunta);
    setTextoEditado(pregunta.texto);
    if (pregunta.tipo === 'opcion_multiple' && pregunta.opciones) {
      setOpcionesEditadas(pregunta.opciones.map((op: any) => op.texto || op.contenido || op));
    } else {
      setOpcionesEditadas([]);
    }
    setShowEditModal(true);
  };

  // Agregar opción en modal de edición
  const agregarOpcionEditada = () => {
    if (!nuevaOpcionEditada.trim()) {
      setError("El texto de la opción no puede estar vacío");
      return;
    }
    
    if (opcionesEditadas.includes(nuevaOpcionEditada.trim())) {
      setError("Esta opción ya existe");
      return;
    }

    setOpcionesEditadas(prev => [...prev, nuevaOpcionEditada.trim()]);
    setNuevaOpcionEditada('');
  };

  // Eliminar opción en modal de edición
  const eliminarOpcionEditada = (texto: string) => {
    setOpcionesEditadas(prev => prev.filter(op => op !== texto));
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!textoEditado.trim()) {
      setError("El texto de la pregunta no puede estar vacío");
      return;
    }

    if (preguntaEditando.tipo === 'opcion_multiple' && opcionesEditadas.length < 2) {
      setError("Debes tener al menos 2 opciones");
      return;
    }

    try {
      await editarPregunta(
        preguntaEditando.id,
        textoEditado,
        preguntaEditando.tipo === 'opcion_multiple' ? opcionesEditadas : undefined
      );
      
      setShowEditModal(false);
      setPreguntaEditando(null);
      setTextoEditado('');
      setOpcionesEditadas([]);
      setSuccess("✅ Pregunta actualizada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al actualizar la pregunta");
      console.error(err);
    }
  };

  // Abrir modal de confirmación de eliminación
  const abrirModalEliminacion = (pregunta: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreguntaAEliminar(pregunta);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!preguntaAEliminar) return;

    try {
      await eliminarPregunta(preguntaAEliminar.id);
      
      // Remover de seleccionadas si estaba seleccionada
      setPreguntasSeleccionadas(prev => prev.filter(id => id !== preguntaAEliminar.id));
      
      setShowDeleteModal(false);
      setPreguntaAEliminar(null);
      setSuccess("✅ Pregunta eliminada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar la pregunta");
      console.error(err);
    }
  };

  const volver = () => {
    navigate("/secretaria/crear-encuesta");
  };

  // Obtener icono y color según tipo de plantilla
  const getPlantillaInfo = (tipo: string) => {
    switch(tipo) {
      case 'encuesta_alumno':
        return { icon: '🎓', color: 'primary', label: 'Encuesta Alumno' };
      case 'informe_sintetico':
        return { icon: '📊', color: 'info', label: 'Informe Sintético' };
      case 'informe_catedra':
        return { icon: '📚', color: 'warning', label: 'Informe Cátedra' };
      default:
        return { icon: '📋', color: 'secondary', label: '' };
    }
  };

  return (
    <Container fluid className="py-4">

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

      <Button variant="secondary" onClick={volver} className="mb-4">
        ← Volver
      </Button>

      {/* Selector de tipo de plantilla */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h5 className="mb-0">🎯 Tipo de Plantilla</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <p className="text-muted mb-4">Selecciona el tipo de encuesta que deseas crear:</p>
          
          <Row className="g-3">
            {/* Encuesta Alumno */}
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer ${tipoPlantilla === 'encuesta_alumno' ? 'border-primary border-3 shadow' : 'border-2'}`}
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => setTipoPlantilla('encuesta_alumno')}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🎓</div>
                  <h5 className="mb-2">Encuesta Alumno</h5>
                  <p className="text-muted small mb-0">
                    Evaluación de cursos desde la perspectiva del estudiante
                  </p>
                  {tipoPlantilla === 'encuesta_alumno' && (
                    <Badge bg="primary" className="mt-3">✓ Seleccionado</Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Informe Sintético */}
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer ${tipoPlantilla === 'informe_sintetico' ? 'border-info border-3 shadow' : 'border-2'}`}
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => setTipoPlantilla('informe_sintetico')}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📊</div>
                  <h5 className="mb-2">Informe Sintético</h5>
                  <p className="text-muted small mb-0">
                    Resumen ejecutivo y análisis de resultados
                  </p>
                  {tipoPlantilla === 'informe_sintetico' && (
                    <Badge bg="info" className="mt-3">✓ Seleccionado</Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Informe Cátedra */}
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer ${tipoPlantilla === 'informe_catedra' ? 'border-warning border-3 shadow' : 'border-2'}`}
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => setTipoPlantilla('informe_catedra')}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📚</div>
                  <h5 className="mb-2">Informe Cátedra</h5>
                  <p className="text-muted small mb-0">
                    Evaluación detallada de la cátedra
                  </p>
                  {tipoPlantilla === 'informe_catedra' && (
                    <Badge bg="warning" className="mt-3">✓ Seleccionado</Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {!tipoPlantilla && (
            <Alert variant="warning" className="mt-4 mb-0">
              <small>⚠️ Debes seleccionar un tipo de plantilla para continuar</small>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* El resto del contenido solo se muestra si hay una plantilla seleccionada */}
      {tipoPlantilla && (
        <>
          {/* Badge indicador */}
          <Alert variant={getPlantillaInfo(tipoPlantilla).color} className="d-flex align-items-center justify-content-between mb-4">
            <span>
              <strong>{getPlantillaInfo(tipoPlantilla).icon} Creando plantilla:</strong> {getPlantillaInfo(tipoPlantilla).label}
            </span>
            <Button 
              variant="outline-dark" 
              size="sm"
              onClick={() => setTipoPlantilla('')}
            >
              Cambiar tipo
            </Button>
          </Alert>

          <Row>

            {/* Izquierda */}
            <Col md={8}>

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
                      value={nuevaPreguntaAbierta}
                      onChange={(e) => setNuevaPreguntaAbierta(e.target.value)}
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
                  <div className="mb-3">
                    <strong>Tipo de plantilla:</strong>
                    <div className="mt-2">
                      <Badge bg={getPlantillaInfo(tipoPlantilla).color} className="fs-6">
                        {getPlantillaInfo(tipoPlantilla).icon} {getPlantillaInfo(tipoPlantilla).label}
                      </Badge>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="mb-2">
                    <strong>Categorías seleccionadas:</strong> 
                    <Badge bg="primary" className="ms-2">{categoriasSeleccionadas.length}</Badge>
                  </div>
                  <div className="mb-3">
                    <strong>Preguntas seleccionadas:</strong> 
                    <Badge bg="success" className="ms-2">{preguntasSeleccionadas.length}</Badge>
                  </div>
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
                                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                  <div className="d-flex align-items-start justify-content-between">
                                    <div 
                                      className="d-flex align-items-start flex-grow-1"
                                      onClick={() => togglePregunta(p.id)}
                                    >
                                      <Form.Check 
                                        checked={preguntasSeleccionadas.includes(p.id)} 
                                        readOnly 
                                        className="me-2"
                                      />
                                      <div className="flex-grow-1">
                                        <Badge bg={p.tipo === 'abierta' ? 'success' : 'info'} className="mb-2">
                                          {p.tipo === 'abierta' ? '📝 Abierta' : '☑️ Cerrada'}
                                        </Badge>
                                        <div className="mb-2">{p.texto}</div>
                                        
                                        {/* Mostrar opciones si existen */}
                                        {p.tipo !== 'abierta' && p.opciones && p.opciones.length > 0 && (
                                          <div className="mt-2">
                                            <small className="text-muted d-block mb-1"><strong>Opciones:</strong></small>
                                            <ListGroup variant="flush" className="border rounded">
                                              {p.opciones.map((op: any, idx: number) => (
                                                <ListGroup.Item key={idx} className="py-1 px-2 small">
                                                  <Badge bg="light" text="dark" className="me-1">{idx + 1}</Badge>
                                                  {op.texto || op.contenido || op}
                                                </ListGroup.Item>
                                              ))}
                                            </ListGroup>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="d-flex gap-1 ms-2">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={(e) => abrirModalEdicion(p, e)}
                                        title="Editar pregunta"
                                      >
                                        ✏️
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) => abrirModalEliminacion(p, e)}
                                        title="Eliminar pregunta"
                                      >
                                        🗑️
                                      </Button>
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
        </>
      )}

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Editar Pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preguntaEditando && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Texto de la pregunta</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                />
              </Form.Group>

              {preguntaEditando.tipo === 'opcion_multiple' && (
                <>
                  <Form.Label>Opciones de respuesta</Form.Label>
                  
                  {opcionesEditadas.length > 0 && (
                    <ListGroup className="mb-3">
                      {opcionesEditadas.map((opcion, index) => (
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
                            onClick={() => eliminarOpcionEditada(opcion)}
                          >
                            ✕
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  <Row>
                    <Col md={9}>
                      <Form.Control
                        placeholder="Nueva opción..."
                        value={nuevaOpcionEditada}
                        onChange={(e) => setNuevaOpcionEditada(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            agregarOpcionEditada();
                          }
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <Button
                        className="w-100"
                        variant="outline-secondary"
                        onClick={agregarOpcionEditada}
                        disabled={!nuevaOpcionEditada.trim()}
                      >
                        + Opción
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            💾 Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🗑️ Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preguntaAEliminar && (
            <>
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>¿Estás seguro de eliminar esta pregunta?</strong>
              </Alert>
              <div className="p-3 bg-light rounded">
                <Badge bg={preguntaAEliminar.tipo === 'abierta' ? 'success' : 'info'} className="mb-2">
                  {preguntaAEliminar.tipo === 'abierta' ? '📝 Abierta' : '☑️ Cerrada'}
                </Badge>
                <p className="mb-0"><strong>{preguntaAEliminar.texto}</strong></p>
              </div>
              <p className="text-muted mt-3 mb-0">
                <small>Esta acción no se puede deshacer.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            🗑️ Eliminar Pregunta
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Botón Guardar Encuesta - Se muestra solo si hay plantilla y preguntas seleccionadas */}
      {tipoPlantilla && preguntasSeleccionadas.length > 0 && (
        <Card className="mt-4 shadow-sm border-success">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h5 className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  ¿Listo para guardar tu encuesta?
                </h5>
                <p className="text-muted mb-0">
                  Tipo: <strong>{getPlantillaInfo(tipoPlantilla).label}</strong> • 
                  Preguntas seleccionadas: <Badge bg="success">{preguntasSeleccionadas.length}</Badge>
                </p>
              </Col>
              <Col md={4} className="text-end">
                <Button 
                  variant="success" 
                  size="lg"
                  className="w-100"
                  onClick={() => {
                    // Aquí iría la lógica para guardar la encuesta
                    console.log('Guardando encuesta:', {
                      tipo: tipoPlantilla,
                      preguntas: preguntasSeleccionadas
                    });
                    setSuccess("✅ Encuesta guardada correctamente");
                    setTimeout(() => {
                      navigate("/secretaria/crear-encuesta");
                    }, 2000);
                  }}
                >
                  <i className="bi bi-save me-2"></i>
                  Guardar Encuesta
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

    </Container>
  );
};