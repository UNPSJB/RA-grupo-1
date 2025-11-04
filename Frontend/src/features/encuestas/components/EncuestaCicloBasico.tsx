import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { useFormularioEncuesta } from '../hooks/useFormularioEncuesta';
import { encuestaService } from '../services/encuestasService';

export const EncuestaCicloBasico: React.FC = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { alumnoId, asignaturaId, nombreAsignatura } = location.state || {};
  const idEncuesta = parseInt(encuestaId || '0');
  
  const { formulario, loading, error } = useFormularioEncuesta(idEncuesta);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  // Verificar que tenemos datos del formulario
  const handleRespuestaChange = (preguntaId: string, valor: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
    if (errorEnvio) setErrorEnvio(null);
  };

  const obtenerTituloSeccion = (seccion: string): string => {
    const titulos: Record<string, string> = {
      'A': 'A: Información General',
      'B': 'B: Comunicación y desarrollo de la asignatura', 
      'C': 'C: Metodología',
      'D': 'D: Evaluación',
      'E': 'E: Actuación de los miembros de la Cátedra',
      'F': 'F: Institucional',
      'G': 'G: Opinión Global'
    };
    return titulos[seccion] || `Sección ${seccion}`;
  };

  const renderizarPreguntaEscala = (pregunta: any, index: number, categoriaCodigo: string) => {
    return (
      <div key={pregunta.id} className="mb-3 p-3 border rounded bg-white">
        <div className="d-flex align-items-start mb-2">
          <Badge bg="secondary" className="me-2 mt-1">
            {categoriaCodigo}.{index + 1}
          </Badge>
          <span className="fw-medium">{pregunta.texto}</span>
        </div>
        
        <Row>
          {pregunta.opciones && pregunta.opciones.map((opcion: any) => (
            <Col key={opcion.id} xs={4} className="mb-2">
              <Form.Check
                type="radio"
                name={`pregunta_${pregunta.id}`}
                id={`p${pregunta.id}_${opcion.id}`}
                label={opcion.texto}
                value={opcion.valor || opcion.texto}
                checked={respuestas[pregunta.id] === (opcion.valor || opcion.texto)}
                onChange={() => handleRespuestaChange(pregunta.id, opcion.valor || opcion.texto)}
                required
              />
            </Col>
          ))}
        </Row>
        
        {pregunta.tipo && (
          <small className="text-muted mt-2 d-block">
            <i className="bi bi-tag me-1"></i>
            Tipo: {pregunta.tipo}
          </small>
        )}
      </div>
    );
  };

  const renderizarPreguntaAbierta = (pregunta: any) => {
    return (
      <div key={pregunta.id} className="mb-4 p-3 border rounded bg-light">
        <h6 className="mb-3">
          <Badge bg="info" className="me-2">{pregunta.seccion}</Badge>
          {pregunta.texto}
        </h6>
        
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escribe tu respuesta aquí..."
            value={respuestas[pregunta.id] || ''}
            onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
          />
        </Form.Group>
      </div>
    );
  };

  const validarFormulario = (): boolean => {
    if (!formulario) return false;
    
    // Contar preguntas de categorías
    let totalPreguntasEscala = 0;
    let respuestasEscalaCompletadas = 0;
    
    formulario.categorias.forEach(categoria => {
      categoria.preguntas.forEach(pregunta => {
        totalPreguntasEscala++;
        if (respuestas[pregunta.id]) {
          respuestasEscalaCompletadas++;
        }
      });
    });
    
    if (respuestasEscalaCompletadas < totalPreguntasEscala) {
      setErrorEnvio(`Por favor responde todas las preguntas de escala (${respuestasEscalaCompletadas}/${totalPreguntasEscala} respondidas)`);
      return false;
    }
    
    return true;
  };

  const handleEnviarEncuesta = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setEnviando(true);
      setErrorEnvio(null);
      
      console.log('Enviando respuestas ciclo básico:', {
        encuestaId: idEncuesta,
        alumnoId,
        asignaturaId,
        respuestas
      });
      
      // Preparar respuestas para el backend
      const respuestasFormateadas = Object.entries(respuestas).map(([preguntaId, valor]) => ({
        pregunta_id: parseInt(preguntaId),
        texto: typeof valor === 'string' ? valor : undefined,
        valor: typeof valor === 'string' ? valor : undefined
      }));
      
      const payload = {
        encuesta_id: idEncuesta,
        alumno_id: alumnoId,
        respuestas: respuestasFormateadas
      };
      
      console.log('Payload a enviar:', payload);
      
      // TODO: Actualizar esta llamada según tu endpoint real de guardar respuestas
      await encuestaService.enviarRespuestasEncuesta(
        idEncuesta, 
        alumnoId, 
        asignaturaId, 
        respuestas
      );
      
      alert('¡Encuesta completada exitosamente!');
      navigate('/alumno/incompletas');
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido';
      setErrorEnvio(`Error al enviar la encuesta: ${mensaje}`);
      console.error('Error al enviar encuesta:', err);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando formulario de encuesta...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al cargar el formulario
          </Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2 mt-3">
            <Button 
              variant="outline-danger" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/alumno/incompletas')}
            >
              Volver a Encuestas
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!formulario) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          El formulario de encuesta no está disponible.
        </Alert>
        <Button variant="secondary" onClick={() => navigate('/alumno/incompletas')}>
          Volver a Encuestas
        </Button>
      </Container>
    );
  }

  // Calcular total de preguntas
  const totalPreguntasEscala = formulario.categorias.reduce(
    (total, categoria) => total + categoria.preguntas.length, 0
  );
  const totalPreguntasAbiertas = formulario.preguntas_abiertas.length;
  const totalPreguntas = totalPreguntasEscala + totalPreguntasAbiertas;

  return (
    <Container className="py-4">
      {/* Header de la encuesta */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 mb-0">
                <i className="bi bi-file-text me-2"></i>
                {formulario.titulo}
              </h1>
              <small className="mt-1 d-block">
                <Badge bg="light" text="dark">
                  <i className="bi bi-info-circle me-1"></i>
                  Formulario de Evaluación
                </Badge>
              </small>
            </div>
            <Badge bg="light" text="dark">
              {totalPreguntas} preguntas
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p className="mb-2">
                <strong>
                  <i className="bi bi-book me-2"></i>
                  Asignatura:
                </strong> 
                {formulario.asignatura}
              </p>
              <p className="mb-2">
                <strong>
                  <i className="bi bi-calendar me-2"></i>
                  Ciclo Lectivo:
                </strong> 
                {formulario.ciclo_lectivo}
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <strong>
                  <i className="bi bi-person me-2"></i>
                  Docente:
                </strong> 
                {formulario.docente || "No asignado"}
              </p>
              <p className="mb-0">
                <strong>
                  <i className="bi bi-list-check me-2"></i>
                  Estructura:
                </strong> 
                <br />
                <small className="text-muted">
                  {formulario.categorias.length} categorías • {totalPreguntasEscala} preguntas escala • {totalPreguntasAbiertas} preguntas abiertas
                </small>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Instrucciones */}
      <Alert variant="info" className="mb-4">
        <h6 className="alert-heading">
          <i className="bi bi-info-circle me-2"></i>
          Instrucciones
        </h6>
        <p className="mb-0">
          Por favor responde todas las preguntas marcando la opción que mejor represente tu opinión. 
          Las respuestas son anónimas y confidenciales.
        </p>
      </Alert>

      {/* Mostrar error de envío si existe */}
      {errorEnvio && (
        <Alert variant="danger" dismissible onClose={() => setErrorEnvio(null)}>
          <i className="bi bi-exclamation-circle me-2"></i>
          {errorEnvio}
        </Alert>
      )}

      {/* Formulario de preguntas por categoría */}
      <Form>
        {formulario.categorias.map((categoria) => (
          <Card key={categoria.id} className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                {categoria.codigo}: {categoria.nombre}
              </h5>
            </Card.Header>
            <Card.Body>
              {categoria.preguntas.map((pregunta, index) => 
                renderizarPreguntaEscala(pregunta, index, categoria.codigo)
              )}
            </Card.Body>
          </Card>
        ))}

        {/* Preguntas abiertas */}
        {formulario.preguntas_abiertas.length > 0 && (
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                Comentarios y Sugerencias
              </h5>
            </Card.Header>
            <Card.Body>
              {formulario.preguntas_abiertas.map(pregunta => 
                renderizarPreguntaAbierta(pregunta)
              )}
            </Card.Body>
          </Card>
        )}

        {/* Resumen y botones de acción */}
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1">Progreso de la encuesta</h6>
                <small className="text-muted">
                  {Object.keys(respuestas).length} de {totalPreguntas} preguntas respondidas
                </small>
              </div>
              <div>
                <Badge bg="primary" className="me-2">
                  Escala: {Object.keys(respuestas).filter(key => 
                    !formulario.preguntas_abiertas.find(p => p.id === key)
                  ).length}/{totalPreguntasEscala}
                </Badge>
                <Badge bg="info">
                  Abiertas: {Object.keys(respuestas).filter(key => 
                    formulario.preguntas_abiertas.find(p => p.id === key)
                  ).length}/{totalPreguntasAbiertas}
                </Badge>
              </div>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/alumno/incompletas')}
                disabled={enviando}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </Button>
              
              <Button
                variant="success"
                size="lg"
                onClick={handleEnviarEncuesta}
                disabled={enviando || Object.keys(respuestas).length === 0}
              >
                {enviando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Finalizar Encuesta
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
};