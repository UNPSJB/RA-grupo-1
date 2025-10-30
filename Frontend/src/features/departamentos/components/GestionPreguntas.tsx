import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Form, Modal, Spinner, Alert, Badge, Accordion
} from 'react-bootstrap';
import { useSecretaria } from '../../secretaria/hooks/useSecretaria';
import { Pregunta, TipoPregunta, CategoriaPregunta } from '../../secretaria/types/encuestasTypes';

export const GestionPreguntas = () => {
  const { 
    preguntas, 
    categorias, 
    crearPregunta, 
    eliminarPregunta, 
    loading, 
    error,
    recargarDatos 
  } = useSecretaria();

  // Estados para gestión
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [preguntaEditando, setPreguntaEditando] = useState<Pregunta | null>(null);
  const [preguntaAEliminar, setPreguntaAEliminar] = useState<Pregunta | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para el formulario
  const [textoPregunta, setTextoPregunta] = useState('');
  const [tipoPregunta, setTipoPregunta] = useState<TipoPregunta>('abierta');
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [opciones, setOpciones] = useState<string[]>(['', '']);
  const [activaPregunta, setActivaPregunta] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    recargarDatos();
  }, []);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Funciones para opciones de preguntas cerradas
  const agregarOpcion = () => {
    setOpciones([...opciones, '']);
  };

  const eliminarOpcion = (index: number) => {
    if (opciones.length > 2) {
      setOpciones(opciones.filter((_, i) => i !== index));
    }
  };

  const actualizarOpcion = (index: number, valor: string) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = valor;
    setOpciones(nuevasOpciones);
  };

  // Modal handlers
  const abrirModalNuevaPregunta = () => {
    setPreguntaEditando(null);
    setTextoPregunta('');
    setTipoPregunta('abierta');
    setCategoriaId(1);
    setOpciones(['', '']);
    setActivaPregunta(true);
    setShowModal(true);
  };

  const abrirModalEditarPregunta = (pregunta: Pregunta) => {
    setPreguntaEditando(pregunta);
    setTextoPregunta(pregunta.texto);
    setTipoPregunta(pregunta.tipo);
    setCategoriaId(pregunta.categoriaId);
    setOpciones(pregunta.opciones || ['', '']);
    setActivaPregunta(pregunta.activa);
    setShowModal(true);
  };

  // Función para manejar el click de eliminar
  const handleEliminarClick = (pregunta: Pregunta) => {
    console.log('🔄 Intentando eliminar pregunta ID:', pregunta.id);
    if (!pregunta.id || isNaN(pregunta.id)) {
      console.error('❌ ID de pregunta inválido:', pregunta.id);
      setError('ID de pregunta inválido');
      return;
    }
    setPreguntaAEliminar(pregunta);
    setShowConfirmDelete(true);
  };

  // Función para confirmar eliminación
  const confirmarEliminacion = async () => {
    if (preguntaAEliminar) {
      try {
        console.log('✅ Confirmando eliminación de pregunta ID:', preguntaAEliminar.id);
        await eliminarPregunta(preguntaAEliminar.id);
        
        setSuccess('Pregunta eliminada exitosamente');
        setShowConfirmDelete(false);
        setPreguntaAEliminar(null);
        
        // Recargar datos para obtener la lista actualizada
        recargarDatos();
      } catch (err) {
        console.error('❌ Error al eliminar pregunta:', err);
        setError('Error al eliminar la pregunta');
      }
    }
  };

  // Validación del formulario
  const validarFormulario = (): boolean => {
    if (!textoPregunta.trim()) {
      return false;
    }
    
    if (tipoPregunta === 'cerrada') {
      const opcionesValidas = opciones.filter(op => op.trim() !== '');
      return opcionesValidas.length >= 2;
    }
    
    return true;
  };

  // Guardar pregunta
  const guardarPregunta = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      await crearPregunta(
        textoPregunta,
        tipoPregunta,
        tipoPregunta === 'cerrada' ? opciones.filter(op => op.trim() !== '') : undefined,
        categoriaId
      );

      setShowModal(false);
      setSuccess(preguntaEditando ? 'Pregunta actualizada exitosamente' : 'Pregunta creada exitosamente');
      
      // Recargar datos para obtener la lista actualizada
      recargarDatos();
    } catch (err) {
      // El error ya se maneja en el hook
    }
  };

  // Helper functions
  const getTipoBadgeVariant = (tipo: TipoPregunta) => {
    return tipo === 'abierta' ? 'primary' : 'success';
  };

  const getTipoText = (tipo: TipoPregunta) => {
    return tipo === 'abierta' ? 'Abierta' : 'Cerrada';
  };

  const getCategoriaNombre = (categoriaId: number) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? `${categoria.codigo}: ${categoria.nombre}` : `Categoría ${categoriaId}`;
  };

  const getEstadoBadgeVariant = (activa: boolean) => {
    return activa ? 'success' : 'secondary';
  };

  // Agrupar preguntas por categoría para vista de acordeón
  const preguntasAgrupadas = categorias.map(categoria => ({
    ...categoria,
    preguntas: preguntas.filter(p => p.categoriaId === categoria.id)
  }));

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando preguntas...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Gestión de Preguntas</h1>
          <p className="text-muted">Administrar todas las preguntas del sistema</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={abrirModalNuevaPregunta}>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Pregunta
          </Button>
        </Col>
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Vista de Acordeón por Categorías */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Preguntas Organizadas por Categorías
          </h5>
          <small className="text-muted">
            {preguntas.length} preguntas disponibles en el sistema
          </small>
        </Card.Header>
        <Card.Body className="p-0">
          {preguntas.length === 0 ? (
            <div className="p-4 text-center">
              <Alert variant="info" className="mb-0">
                No hay preguntas disponibles. Crea la primera pregunta.
              </Alert>
            </div>
          ) : (
            <Accordion defaultActiveKey="0">
              {preguntasAgrupadas.map((categoria, index) => (
                <Accordion.Item key={categoria.id} eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex align-items-center">
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
                            <Card>
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                      <Badge 
                                        bg={getTipoBadgeVariant(pregunta.tipo)} 
                                        className="me-2"
                                      >
                                        {getTipoText(pregunta.tipo)}
                                      </Badge>
                                      <Badge 
                                        bg={getEstadoBadgeVariant(pregunta.activa)}
                                        className="me-2"
                                      >
                                        {pregunta.activa ? 'Activa' : 'Inactiva'}
                                      </Badge>
                                      <Badge bg="secondary">
                                        Orden: {pregunta.orden}
                                      </Badge>
                                    </div>
                                    <p className="mb-2">{pregunta.texto}</p>
                                    {pregunta.tipo === 'cerrada' && pregunta.opciones && (
                                      <small className="text-muted">
                                        <strong>Opciones:</strong> {pregunta.opciones.join(', ')}
                                      </small>
                                    )}
                                    <div className="mt-2">
                                      <small className="text-muted">
                                        Creada: {new Date(pregunta.fechaCreacion).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-column gap-2 ms-3">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => abrirModalEditarPregunta(pregunta)}
                                      title="Editar pregunta"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleEliminarClick(pregunta)}
                                      title="Eliminar pregunta"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
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

      {/* Modal para crear/editar pregunta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {preguntaEditando ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Pregunta *</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Pregunta Abierta"
                      name="tipoPregunta"
                      value="abierta"
                      checked={tipoPregunta === 'abierta'}
                      onChange={(e) => setTipoPregunta(e.target.value as TipoPregunta)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Pregunta Cerrada"
                      name="tipoPregunta"
                      value="cerrada"
                      checked={tipoPregunta === 'cerrada'}
                      onChange={(e) => setTipoPregunta(e.target.value as TipoPregunta)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.codigo}: {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Texto de la Pregunta *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={textoPregunta}
                onChange={(e) => setTextoPregunta(e.target.value)}
                placeholder="Ingresa el texto de la pregunta..."
                required
              />
            </Form.Group>

            {/* Opciones para preguntas cerradas */}
            {tipoPregunta === 'cerrada' && (
              <Form.Group className="mb-3">
                <Form.Label>Opciones de Respuesta *</Form.Label>
                <small className="text-muted d-block mb-2">
                  Mínimo 2 opciones. Las opciones vacías no se guardarán.
                </small>
                
                {opciones.map((opcion, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      value={opcion}
                      onChange={(e) => actualizarOpcion(index, e.target.value)}
                      placeholder={`Opción ${index + 1}`}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => eliminarOpcion(index)}
                      disabled={opciones.length <= 2}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline-primary" size="sm" onClick={agregarOpcion}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Agregar Opción
                </Button>
              </Form.Group>
            )}

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
          <Button 
            variant="primary" 
            onClick={guardarPregunta}
            disabled={!validarFormulario()}
          >
            {preguntaEditando ? 'Actualizar' : 'Crear'} Pregunta
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preguntaAEliminar && (
            <>
              <p>¿Estás seguro de que quieres eliminar esta pregunta?</p>
              <div className="alert alert-warning">
                <strong>{preguntaAEliminar.texto}</strong>
              </div>
              <div className="mb-2">
                <small>
                  <strong>Tipo:</strong> {getTipoText(preguntaAEliminar.tipo)} | 
                  <strong> Categoría:</strong> {getCategoriaNombre(preguntaAEliminar.categoriaId)}
                </small>
              </div>
              <p className="text-danger">
                <small>Esta acción no se puede deshacer.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};