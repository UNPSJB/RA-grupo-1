import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Form, Alert, Badge, Row, Col, ProgressBar as BSProgressBar } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CheckCircle } from 'react-bootstrap-icons';

interface Categoria {
  id: number;
  codigo: string;
  nombre: string;
  orden: number;
  preguntas: Pregunta[];
}

interface Pregunta {
  id: number;
  texto: string;
  tipo: 'cerrada' | 'abierta';
  opciones?: string[];
  categoriaId: number;
  orden: number;
  subpreguntas?: Subpregunta[]; 
}

interface Subpregunta {
  id: string;
  titulo: string;
  opciones: string[];
}

interface Respuesta {
  preguntaId: number;
  opcionSeleccionada?: string;
  textoRespuesta?: string;
  subrespuestas?: Map<string, string>;  
}
const getCategoriaIcon = (codigo: string) => {
  const icons: { [key: string]: string } = {
    'A': '📋',
    'B': '📚',
    'C': '💬',
    'D': '✅',
    'E': '👨‍🏫',
    'F': '🏛️',
    'G': '💭'
  };
  return icons[codigo] || '📄';
};

export function CompletarEncuesta() {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { alumnoId, nombreAsignatura, asignaturaId } = location.state || {};

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActual, setCategoriaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Map<number, Respuesta>>(new Map());
  const [mostrarError, setMostrarError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEncuesta();
  }, [encuestaId]);

  const cargarEncuesta = async () => {
    try {
      setLoading(true);
      
      //Llamar a la API
      // const response = await fetch(`http://127.0.0.1:8000/encuestas/${encuestaId}/categorias`);
      // const data = await response.json();
  
      const categoriasEjemplo: Categoria[] = [
        {
          id: 1,
          codigo: 'C',
          nombre: 'Comunicación y Desarrollo',
          orden: 1,
          preguntas: [
            {
              id: 1,
              texto: '¿El profesor brindó al inicio del curso, información referida al desarrollo de la asignatura (programa, cronograma, régimen de cursada y criterios de evaluación)?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 1,
              orden: 1
            },
            {
              id: 2,
              texto: '¿La bibliografía propuesta por la cátedra estuvo disponible en la biblioteca o centros de documentación?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 1,
              orden: 2
            },
            {
              id: 3,
              texto: '¿El profesor ofreció la posibilidad de establecer una buena comunicación en diferentes aspectos de la vida universitaria?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 1,
              orden: 3
            }
          ]
        },
        {
          id: 2,
          codigo: 'M',
          nombre: 'Metodología',
          orden: 2,
          preguntas: [
            {
              id: 4,
              texto: '¿Se propusieron clases de apoyo y consultas?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 2,
              orden: 1
            },
            {
              id: 5,
              texto: '¿Los contenidos desarrollados en las clases teóricas se correspondieron con los trabajos prácticos?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 2,
              orden: 2
            },
            {
              id: 6,
              texto: '¿Las clases prácticas de laboratorio te resultaron de utilidad?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 2,
              orden: 3
            }
          ]
        },
        {
          id: 3,
          codigo: 'E',
          nombre: 'Evaluación',
          orden: 3,
          preguntas: [
            {
              id: 7,
              texto: '¿Hubo relación entre el desarrollo de las clases teóricas y prácticas?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 3,
              orden: 1
            },
            {
              id: 8,
              texto: '¿Existió relación entre los temas desarrollados en clase y los temas evaluados?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 3,
              orden: 2
            },
            {
              id: 9,
              texto: '¿Te brindaron posibilidades para comentar y revisar los resultados de los exámenes parciales?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 3,
              orden: 3
            }
          ]
        },
        {
          id: 4,
          codigo: 'AD',
          nombre: 'Actuación Docente',
          orden: 4,
          preguntas: [
            {
              id: 10,
              texto: '¿Se respetó la planificación de actividades programadas?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 1,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            },
            {
              id: 11,
              texto: '¿Los profesores asisten con puntualidad en el horario establecido?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 2,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            },
            {
              id: 12,
              texto: '¿Da a la asignatura un enfoque aplicado ofreciendo ejemplos, demostraciones, formas de transferencias a la vida cotidiana y profesional?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 3,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            },
            {
              id: 13,
              texto: '¿Los recursos didácticos utilizados te facilitaron el aprendizaje?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 4,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            },
            {
              id: 14,
              texto: '¿Los profesores te ofrecen la posibilidad de plantear tus dudas y dificultades en clase?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 5,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            },
            {
              id: 15,
              texto: '¿Los docentes explican con claridad los temas desarrollados?',
              tipo: 'cerrada',
              categoriaId: 4,
              orden: 6,
              subpreguntas: [
                { id: 'teoria', titulo: 'TEORÍA', opciones: ['Sí', 'No', 'NPO'] },
                { id: 'practica', titulo: 'PRÁCTICA', opciones: ['Sí', 'No', 'NPO'] }
              ]
            }
          ]
        },
        {
          id: 5,
          codigo: 'I',
          nombre: 'Institucional',
          orden: 5,
          preguntas: [
            {
              id: 16,
              texto: '¿El personal administrativo de la Facultad respondió a tus requerimientos?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 1
            },
            {
              id: 17,
              texto: '¿El personal administrativo respondió cordialmente las consultas que realizaste?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 2
            },
            {
              id: 18,
              texto: '¿El servicio de Biblioteca de la sede es adecuado a tus necesidades?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 3
            },
            {
              id: 19,
              texto: '¿El Sistema Sui Guaraní te facilitó la realización de trámites administrativos?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 4
            },
            {
              id: 20,
              texto: '¿Consideras que son adecuadas las aulas y el equipamiento de los laboratorios?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 5
            },
            {
              id: 21,
              texto: '¿Te parecen suficientes los recursos informáticos que te ofrece la institución (pc, pc con internet, wifi, etc.)?',
              tipo: 'cerrada',
              opciones: ['Sí', 'No', 'NPO'],
              categoriaId: 5,
              orden: 6
            }
          ]
        },
        {
          id: 6,
          codigo: 'OG',
          nombre: 'Opinión Global',
          orden: 6,
          preguntas: [
            {
              id: 22,
              texto: 'En general ¿cómo evalúas tu experiencia de aprendizaje en esta asignatura?',
              tipo: 'cerrada',
              opciones: ['4 - Muy Satisfactorio', '3 - Satisfactorio', '2 - Poco Satisfactorio', '1 - No Satisfactorio'],
              categoriaId: 6,
              orden: 1
            },
            {
              id: 23,
              texto: '¿Qué aspectos valoras como positivos del cursado de la asignatura? Menciona los que consideras más importantes',
              tipo: 'abierta',
              categoriaId: 6,
              orden: 2
            },
            {
              id: 24,
              texto: '¿Qué aspectos consideras que se pueden mejorar? Menciona los que consideras más importantes',
              tipo: 'abierta',
              categoriaId: 6,
              orden: 3
            },
            {
              id: 25,
              texto: '¿Qué recomendaciones le harías a un compañero que cursará el año que viene la asignatura?',
              tipo: 'abierta',
              categoriaId: 6,
              orden: 4
            },
            {
              id: 26,
              texto: 'Si en alguna pregunta respondiste "no puedo opinar" ¿Querés aclarar por qué?',
              tipo: 'abierta',
              categoriaId: 6,
              orden: 5
            }
          ]
        }
      ];

      setCategorias(categoriasEjemplo);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando encuesta:', error);
      setLoading(false);
    }
  };

  const categoriaActiva = categorias[categoriaActual];
  const totalCategorias = categorias.length;
  const esUltimaCategoria = categoriaActual === totalCategorias - 1;
  const progreso = ((categoriaActual + 1) / totalCategorias) * 100;

  const handleRespuesta = (preguntaId: number, valor: string, subpreguntaId?: string) => {
    const nuevasRespuestas = new Map(respuestas);
    const respuestaExistente = nuevasRespuestas.get(preguntaId) || { preguntaId };
    
    if (subpreguntaId) {
      const subrespuestas = respuestaExistente.subrespuestas || new Map();
      subrespuestas.set(subpreguntaId, valor);
      respuestaExistente.subrespuestas = subrespuestas;
    } else {
      if (categoriaActiva.preguntas.find(p => p.id === preguntaId)?.tipo === 'abierta') {
        respuestaExistente.textoRespuesta = valor;
      } else {
        respuestaExistente.opcionSeleccionada = valor;
      }
    }
    
    nuevasRespuestas.set(preguntaId, respuestaExistente);
    setRespuestas(nuevasRespuestas);
    setMostrarError(false);
  };

  const validarCategoriaActual = (): boolean => {
    if (!categoriaActiva) return true;
    
    for (const pregunta of categoriaActiva.preguntas) {
      const respuesta = respuestas.get(pregunta.id);
      
      if (pregunta.subpreguntas) {
        if (!respuesta || !respuesta.subrespuestas) return false;
        for (const sub of pregunta.subpreguntas) {
          if (!respuesta.subrespuestas.get(sub.id)) return false;
        }
      } else {
        if (pregunta.tipo === 'cerrada') {
          if (!respuesta || !respuesta.opcionSeleccionada) return false;
        }
      }
    }
    return true;
  };

  const handleSiguiente = () => {
    if (!validarCategoriaActual()) {
      setMostrarError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (esUltimaCategoria) {
      handleEnviar();
    } else {
      setCategoriaActual(prev => prev + 1);
      setMostrarError(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnterior = () => {
    if (categoriaActual > 0) {
      setCategoriaActual(prev => prev - 1);
      setMostrarError(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEnviar = async () => {
    try {
      const respuestasArray = Array.from(respuestas.values()).map(r => ({
        preguntaId: r.preguntaId,
        opcionSeleccionada: r.opcionSeleccionada,
        textoRespuesta: r.textoRespuesta,
        subrespuestas: r.subrespuestas ? Object.fromEntries(r.subrespuestas) : undefined
      }));
      
      console.log('Enviando respuestas:', {
        alumnoId,
        encuestaId,
        asignaturaId,
        respuestas: respuestasArray
      });

      // LLAMADA A LA API
      // await fetch(`http://127.0.0.1:8000/encuestas/${encuestaId}/respuestas`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     alumno_id: alumnoId,
      //     asignatura_id: asignaturaId,
      //     respuestas: respuestasArray 
      //   })
      // });

      alert('¡Encuesta completada exitosamente!');
      navigate('/alumno/completadas');
    } catch (error) {
      console.error('Error enviando encuesta:', error);
      alert('Error al enviar la encuesta');
    }
  };

  const handleVolver = () => {
    if (window.confirm('¿Estás seguro de que quieres salir? Se perderán las respuestas no guardadas.')) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando encuesta...</p>
      </Container>
    );
  }

  if (!categoriaActiva) {
    return (
      <Container className="py-5">
        <Alert variant="danger">No se encontraron preguntas para esta encuesta.</Alert>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Header */}
      <div 
        className="py-3 mb-4 shadow-sm" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '4px solid #5a67d8'
        }}
      >
        <Container>
          <div className="d-flex align-items-center mb-3">
            <Button 
              variant="link" 
              className="text-white text-decoration-none p-0 me-3"
              onClick={handleVolver}
            >
              <ArrowLeft size={24} />
              <span className="ms-2">Volver</span>
            </Button>
            <div className="flex-grow-1">
              <h4 className="mb-0 text-white d-flex align-items-center">
                <i className="bi bi-mortarboard-fill me-2"></i>
                Encuesta de Evaluación Docente
              </h4>
              <p className="mb-0 small" style={{ color: '#ffffffcc' }}>
                {nombreAsignatura || 'Desarrollo de Software'}
              </p>
            </div>
            <Badge bg="light" text="dark" className="px-3 py-2">
              Ciclo Básico
            </Badge>
          </div>
          
          {/* Barra de progreso */}
          <div>
            <div className="d-flex justify-content-between mb-2">
              <small className="text-white">Progreso de la encuesta</small>
              <small className="text-white">Sección {categoriaActual + 1} de {totalCategorias}</small>
            </div>
            <BSProgressBar 
              now={progreso} 
              style={{ height: '8px', backgroundColor: '#ffffff4d' }}
              className="rounded"
            />
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Card de Categoría */}
        <Card className="shadow-sm mb-4">
          <Card.Header 
            className="p-4"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderBottom: 'none'
            }}
          >
            <div className="d-flex align-items-center">
              <span className="me-3 fs-4">{getCategoriaIcon(categoriaActiva.codigo)}</span>
              <div>
                <h5 className="mb-0 text-white">{categoriaActiva.nombre}</h5>
                <small style={{ color: '#ffffffcc' }}>
                  Responde Sí, No o NPO (No puedo opinar) según corresponda
                </small>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-4" style={{ backgroundColor: '#fef9e7' }}>
            {/* Preguntas */}
            {categoriaActiva.preguntas.map((pregunta, index) => (
              <div 
                key={pregunta.id} 
                className="mb-4 p-4 bg-white rounded shadow-sm"
              >
                <div className="d-flex align-items-start mb-3">
                  <Badge 
                    bg="primary" 
                    className="rounded-circle me-3" 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    {index + 1}
                  </Badge>
                  <div className="flex-grow-1">
                    <p className="mb-3 fw-medium">{pregunta.texto}</p>
                    {pregunta.subpreguntas ? (
                      <div className="ms-4">
                        {pregunta.subpreguntas.map(sub => (
                          <div key={sub.id} className="mb-3">
                            <p className="mb-2 text-muted small fw-bold">{sub.titulo}</p>
                            <Row className="g-2">
                              {sub.opciones.map((opcion, idx) => {
                                const isSelected = respuestas.get(pregunta.id)?.subrespuestas?.get(sub.id) === opcion;
                                return (
                                  <Col xs={4} key={idx}>
                                    <div 
                                      className={`p-2 rounded border-2 text-center ${
                                        isSelected 
                                          ? 'border-primary bg-primary bg-opacity-10' 
                                          : 'border-secondary bg-white'
                                      }`}
                                      onClick={() => handleRespuesta(pregunta.id, opcion, sub.id)}
                                      style={{ 
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        borderStyle: 'solid'
                                      }}
                                    >
                                      <Form.Check
                                        type="radio"
                                        name={`pregunta-${pregunta.id}-${sub.id}`}
                                        label={opcion}
                                        checked={isSelected}
                                        onChange={() => handleRespuesta(pregunta.id, opcion)}
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          </div>
                        ))}
                      </div>
                    ) : pregunta.tipo === 'abierta' ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Escribe tu respuesta aquí..."
                        value={respuestas.get(pregunta.id)?.textoRespuesta || ''}
                        onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                        className="mt-2"
                      />
                    ) : (
                      <Row className="g-3">
                        {pregunta.opciones?.map((opcion, idx) => {
                          const isSelected = respuestas.get(pregunta.id)?.opcionSeleccionada === opcion;
                          return (
                            <Col md={pregunta.opciones!.length === 3 ? 4 : 6} key={idx}>
                              <div 
                                className={`p-3 rounded border-2 ${
                                  isSelected 
                                    ? 'border-primary bg-primary bg-opacity-10' 
                                    : 'border-secondary bg-white'
                                }`}
                                onClick={() => handleRespuesta(pregunta.id, opcion)}
                                style={{ 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  borderStyle: 'solid'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = '#6c757d';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }
                                }}
                              >
                                <Form.Check
                                  type="radio"
                                  name={`pregunta-${pregunta.id}`}
                                  label={opcion}
                                  checked={isSelected}
                                  onChange={() => handleRespuesta(pregunta.id, opcion)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-between align-items-center">
          <Button 
            variant="outline-secondary" 
            onClick={handleAnterior}
            disabled={categoriaActual === 0}
            className="px-4"
          >
            <ArrowLeft className="me-2" />
            Anterior
          </Button>

          <div className="text-center">
            <small className="text-muted">
              Sección {categoriaActual + 1} de {totalCategorias}
            </small>
          </div>

          <Button 
            variant={esUltimaCategoria ? 'success' : 'primary'}
            onClick={handleSiguiente}
            className="px-4"
          >
            {esUltimaCategoria ? (
              <>
                <CheckCircle className="me-2" />
                Enviar Encuesta
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ms-2" />
              </>
            )}
          </Button>
        </div>
        {mostrarError && (
          <Alert variant="warning" className="mt-4 d-flex align-items-center">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            Completa todas las preguntas obligatorias de esta sección para continuar
          </Alert>
        )}
      </Container>
    </div>
  );
}