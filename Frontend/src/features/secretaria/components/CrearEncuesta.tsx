import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEncuestas } from '../hooks/useEncuestas';
import { Pregunta } from '../types/encuestasTypes';

export const CrearEncuesta = () => {
  const { preguntas, categorias, crearEncuesta } = useEncuestas();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    rolDestinatario: 'alumno'
  });
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<number[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Agrupar preguntas por categoría
  const preguntasAgrupadas = categorias.map(categoria => ({
    ...categoria,
    preguntas: preguntas.filter(p => p.categoriaId === categoria.id)
  }));

  const togglePregunta = (preguntaId: number) => {
    setPreguntasSeleccionadas(prev => 
      prev.includes(preguntaId)
        ? prev.filter(id => id !== preguntaId)
        : [...prev, preguntaId]
    );
  };

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

  const getPreguntaSeleccionada = (preguntaId: number) => {
    return preguntasSeleccionadas.includes(preguntaId);
  };

  const getCategoriaSeleccionada = (categoriaId: number) => {
    return categoriasSeleccionadas.includes(categoriaId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (preguntasSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una pregunta');
      return;
    }

    if (!formData.titulo || !formData.fechaInicio || !formData.fechaFin) {
      setError('Todos los campos marcados con * son obligatorios');
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
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
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
          <p className="text-muted">Configura una nueva encuesta seleccionando preguntas por categorías</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
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
                      <Form.Label>Fecha de Inicio *</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Fin *</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
          </Col>

          <Col md={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Resumen</h5>
              </Card.Header>
              <Card.Body>
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
                  disabled={preguntasSeleccionadas.length === 0}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Crear Encuesta
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                                            <Badge 
                                              bg={pregunta.tipo === 'abierta' ? 'primary' : 'success'} 
                                              className="mb-1"
                                            >
                                              {pregunta.tipo === 'abierta' ? 'Abierta' : 'Cerrada'}
                                            </Badge>
                                            <Badge bg="secondary">Orden: {pregunta.orden}</Badge>
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
    </Container>
  );
};