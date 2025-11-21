import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Confetti from "react-confetti";
import "../styles/CompletarEncuesta.css";

// =========================================================
//  HARDCODE — ENCUESTA BASE (DEBE IR FUERA DEL COMPONENTE)
// =========================================================
export const ENCUESTA_BASE = {
  id: 1,
  titulo: "Encuesta de Opinión de Asignatura",
  asignatura: "Estadística",
  codigo_asignatura: "M006",
  docente: "Adriana Saavedra",
  ciclo_lectivo: "2025",
  carrera: "Analista Programador Universitario",

  categorias: [
    {
      id: 1,
      codigo: "A",
      nombre: "Información General",
      preguntas: [
        {
          id: 1,
          texto: "¿Cuántas veces te has inscripto para cursar esta asignatura?",
          tipo: "opcion_multiple",
          opciones: [
            { id: 1, texto: "Una" },
            { id: 2, texto: "Más de una" }
          ]
        },
        {
          id: 2,
          texto: "¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases teóricas?",
          tipo: "opcion_multiple",
          opciones: [
            { id: 3, texto: "Entre 0% y 50%" },
            { id: 4, texto: "Más de 50%" }
          ],
          requiereMotivo: true
        },
        {
          id: 3,
          texto: "¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases prácticas?",
          tipo: "opcion_multiple",
          opciones: [
            { id: 5, texto: "Entre 0% y 50%" },
            { id: 6, texto: "Más de 50%" }
          ],
          requiereMotivo: true
        },
        {
          id: 4,
          texto: "Los conocimientos previos para comprender los contenidos de la asignatura fueron:",
          tipo: "opcion_multiple",
          opciones: [
            { id: 7, texto: "Escasos" },
            { id: 8, texto: "Suficientes" }
          ]
        }
      ]
    },

    // B
    {
      id: 2,
      codigo: "B",
      nombre: "Sobre la Asignatura",
      preguntas: [
        {
          id: 5,
          texto: "Los objetivos de la asignatura fueron presentados en forma clara.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 9, texto: "De acuerdo" },
            { id: 10, texto: "Parcialmente de acuerdo" },
            { id: 11, texto: "En desacuerdo" }
          ]
        },
        {
          id: 6,
          texto: "Los contenidos desarrollados guardan coherencia con los objetivos.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 12, texto: "De acuerdo" },
            { id: 13, texto: "Parcialmente de acuerdo" },
            { id: 14, texto: "En desacuerdo" }
          ]
        },
        {
          id: 7,
          texto: "El material bibliográfico fue suficiente y pertinente.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 15, texto: "De acuerdo" },
            { id: 16, texto: "Parcialmente de acuerdo" },
            { id: 17, texto: "En desacuerdo" }
          ]
        }
      ]
    },

    // C
    {
      id: 3,
      codigo: "C",
      nombre: "Sobre el Desarrollo de las Clases",
      preguntas: [
        {
          id: 8,
          texto: "El docente explica con claridad los contenidos.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 18, texto: "De acuerdo" },
            { id: 19, texto: "Parcialmente de acuerdo" },
            { id: 20, texto: "En desacuerdo" }
          ]
        },
        {
          id: 9,
          texto: "Durante las clases se incentiva la participación del alumno.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 21, texto: "De acuerdo" },
            { id: 22, texto: "Parcialmente de acuerdo" },
            { id: 23, texto: "En desacuerdo" }
          ]
        },
        {
          id: 10,
          texto: "El docente utiliza ejemplos pertinentes para facilitar la comprensión.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 24, texto: "De acuerdo" },
            { id: 25, texto: "Parcialmente de acuerdo" },
            { id: 26, texto: "En desacuerdo" }
          ]
        }
      ]
    },

    // D
    {
      id: 4,
      codigo: "D",
      nombre: "Prácticas y Trabajos",
      preguntas: [
        {
          id: 11,
          texto: "Las actividades prácticas fueron adecuadas para comprender los contenidos.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 27, texto: "De acuerdo" },
            { id: 28, texto: "Parcialmente de acuerdo" },
            { id: 29, texto: "En desacuerdo" }
          ]
        },
        {
          id: 12,
          texto: "La carga de trabajos prácticos fue adecuada al tiempo disponible.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 30, texto: "De acuerdo" },
            { id: 31, texto: "Parcialmente de acuerdo" },
            { id: 32, texto: "En desacuerdo" }
          ]
        }
      ]
    },

    // E
    {
      id: 5,
      codigo: "E",
      nombre: "Sistema de Evaluación",
      preguntas: [
        {
          id: 13,
          texto: "Las evaluaciones fueron coherentes con los contenidos enseñados.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 33, texto: "De acuerdo" },
            { id: 34, texto: "Parcialmente de acuerdo" },
            { id: 35, texto: "En desacuerdo" }
          ]
        },
        {
          id: 14,
          texto: "Los criterios de evaluación fueron claramente explicados.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 36, texto: "De acuerdo" },
            { id: 37, texto: "Parcialmente de acuerdo" },
            { id: 38, texto: "En desacuerdo" }
          ]
        }
      ]
    },

    // F
    {
      id: 6,
      codigo: "F",
      nombre: "Relación Docente - Alumno",
      preguntas: [
        {
          id: 15,
          texto: "El docente muestra disposición para atender dudas.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 39, texto: "De acuerdo" },
            { id: 40, texto: "Parcialmente de acuerdo" },
            { id: 41, texto: "En desacuerdo" }
          ]
        },
        {
          id: 16,
          texto: "El trato del docente es respetuoso.",
          tipo: "opcion_multiple",
          opciones: [
            { id: 42, texto: "De acuerdo" },
            { id: 43, texto: "Parcialmente de acuerdo" },
            { id: 44, texto: "En desacuerdo" }
          ]
        }
      ]
    },

    // G
    {
      id: 7,
      codigo: "G",
      nombre: "Comentarios Finales",
      preguntas: [
        {
          id: 17,
          texto: "Escribe sugerencias o comentarios generales sobre la asignatura.",
          tipo: "abierta"
        }
      ]
    }
  ]
};

// Opciones para el motivo de baja asistencia
const MOTIVOS_ASISTENCIA = [
  { value: "a", label: "Superposición de horarios con materias de otros años" },
  { value: "b", label: "Incompatibilidad de horarios con tu trabajo" },
  { value: "c", label: "Preferís formato por tu cuenta bibliografía y/o material de trabajo" },
  { value: "d", label: "Enfermedad de larga duración" },
  { value: "e", label: "Problemas personales" },
  { value: "f", label: "Otros" }
];

// =========================================================
//              COMPONENTE PRINCIPAL
// =========================================================
export default function CompletarEncuesta() {

  const { encuestaId } = useParams();
  const navigate = useNavigate();
  const alumnoId = localStorage.getItem("alumno_id") || 1;

  const [encuesta, setEncuesta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [indexCategoria, setIndexCategoria] = useState(0);
  
  // Estado para almacenar respuestas: { preguntaId: respuesta }
  const [respuestas, setRespuestas] = useState<Record<number, any>>({});
  
  // Estado para motivos de asistencia (preguntas A2 y A3)
  const [motivosAsistencia, setMotivosAsistencia] = useState<Record<number, string>>({});
  
  // Estado para mensaje de error
  const [errorValidacion, setErrorValidacion] = useState<string>("");

  // Estados para el modal de éxito y confeti
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const cargarEncuesta = async () => {
    setLoading(true);
    setEncuesta(ENCUESTA_BASE);
    setLoading(false);
  };

  useEffect(() => {
    cargarEncuesta();
  }, []);

  // Actualizar dimensiones de la ventana para el confeti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Countdown para el modal de éxito
  useEffect(() => {
    if (mostrarModalExito && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (mostrarModalExito && countdown === 0) {
      navigate('/alumno/completadas');
    }
  }, [mostrarModalExito, countdown, navigate]);

  // Detener confeti después de 5 segundos
  useEffect(() => {
    if (mostrarConfeti) {
      const timer = setTimeout(() => {
        setMostrarConfeti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mostrarConfeti]);

  // Manejar cambio de respuesta
  const handleRespuestaChange = (preguntaId: number, valor: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
    
    // Limpiar error si había
    setErrorValidacion("");
  };

  // Manejar cambio de motivo de asistencia
  const handleMotivoChange = (preguntaId: number, motivo: string) => {
    setMotivosAsistencia(prev => ({
      ...prev,
      [preguntaId]: motivo
    }));
  };

  // Validar que todas las preguntas estén respondidas
  const validarCategoria = (): boolean => {
    const categoria = encuesta.categorias[indexCategoria];
    
    for (const pregunta of categoria.preguntas) {
      const respuesta = respuestas[pregunta.id];
      
      // Verificar si la pregunta está respondida
      if (!respuesta || (pregunta.tipo === "abierta" && respuesta.trim() === "")) {
        setErrorValidacion(`Debes responder todas las preguntas antes de continuar`);
        return false;
      }
      
      // Si requiere motivo y seleccionó "Entre 0% y 50%", validar motivo
      if (pregunta.requiereMotivo) {
        const opcionSeleccionada = pregunta.opciones.find((op: any) => op.id === parseInt(respuesta));
        if (opcionSeleccionada && opcionSeleccionada.texto === "Entre 0% y 50%") {
          if (!motivosAsistencia[pregunta.id]) {
            setErrorValidacion(`Debes seleccionar un motivo para la baja asistencia`);
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Navegar a siguiente categoría
  const handleSiguiente = () => {
    if (!validarCategoria()) {
      return;
    }
    
    if (indexCategoria < encuesta.categorias.length - 1) {
      setIndexCategoria(indexCategoria + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navegar a categoría anterior
  const handleAnterior = () => {
    setErrorValidacion("");
    setIndexCategoria(indexCategoria - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enviar encuesta
  const handleEnviar = async () => {
    if (!validarCategoria()) {
      return;
    }
    
    try {
      console.log("Enviando respuestas:", {
        alumnoId,
        encuestaId,
        respuestas,
        motivosAsistencia
      });
      
      // TODO: Llamar API
      /*
      await fetch(`http://localhost:8000/encuestas/${encuestaId}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumno_id: alumnoId,
          respuestas,
          motivos_asistencia: motivosAsistencia
        })
      });
      */
      
      // Mostrar modal y confeti
      setMostrarModalExito(true);
      setMostrarConfeti(true);
      setCountdown(5);
      
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      alert("Error al enviar la encuesta");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!encuesta) return <p>No se encontró la encuesta</p>;

  const categoria = encuesta.categorias[indexCategoria];
  
  // Calcular progreso basado en categorías completadas
  const progreso = (indexCategoria / encuesta.categorias.length) * 100;

  return (
    <>
      {/* Confeti */}
      {mostrarConfeti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.3}
        />
      )}

      <div className="encuesta-wrapper">

        {/* HEADER */}
        <div className="encuesta-header shadow-sm p-4 mb-4 rounded">
          <div>
            <span className="badge bg-primary px-3 py-2 me-2">
              {encuesta.codigo_asignatura}
            </span>
            <span className="badge bg-secondary px-3 py-2">
              {encuesta.ciclo_lectivo}
            </span>

            <h2 className="mt-3 fw-bold">{encuesta.asignatura}</h2>
            <p className="text-muted mb-1">
              Año {encuesta.ciclo_lectivo} · {encuesta.carrera}
            </p>
            <p className="text-muted">
              <strong>Docente:</strong> {encuesta.docente}
            </p>
          </div>
        </div>

        {/* PROGRESO */}
        <div className="progress mb-4">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            style={{ width: `${progreso}%` }}
          >
            {Math.round(progreso)}%
          </div>
        </div>

        {/* CATEGORÍA */}
        <div className="categoria-box p-4 shadow-sm rounded">
          <h3 className="mb-4">
            {categoria.codigo} – {categoria.nombre}
          </h3>

          {categoria.preguntas.map((preg: any, idx: number) => (
            <div key={preg.id} className="mb-4 p-3 border rounded bg-light">
              <p className="fw-semibold mb-3">
                <span className="badge bg-primary me-2">{idx + 1}</span>
                {preg.texto}
              </p>

              {preg.tipo === "abierta" ? (
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={respuestas[preg.id] || ""}
                  onChange={(e) => handleRespuestaChange(preg.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                />
              ) : (
                <>
                  {preg.opciones.map((op: any) => (
                    <div key={op.id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`preg-${preg.id}`}
                        id={`preg-${preg.id}-op-${op.id}`}
                        value={op.id}
                        checked={respuestas[preg.id] === op.id.toString()}
                        onChange={(e) => handleRespuestaChange(preg.id, e.target.value)}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`preg-${preg.id}-op-${op.id}`}
                      >
                        {op.texto}
                      </label>
                    </div>
                  ))}
                  
                  {/* Select adicional para motivos de asistencia (A2 y A3) */}
                  {preg.requiereMotivo && respuestas[preg.id] && (
                    (() => {
                      const opcionSeleccionada = preg.opciones.find(
                        (op: any) => op.id === parseInt(respuestas[preg.id])
                      );
                      return opcionSeleccionada?.texto === "Entre 0% y 50%" ? (
                        <div className="mt-3 p-3 border rounded bg-white">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-info-circle me-2"></i>
                            ¿Cuál fue el motivo principal de tu baja asistencia?
                          </label>
                          <select
                            className="form-select"
                            value={motivosAsistencia[preg.id] || ""}
                            onChange={(e) => handleMotivoChange(preg.id, e.target.value)}
                          >
                            <option value="">Selecciona un motivo...</option>
                            {MOTIVOS_ASISTENCIA.map((motivo) => (
                              <option key={motivo.value} value={motivo.value}>
                                {motivo.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null;
                    })()
                  )}
                </>
              )}
            </div>
          ))}

          {/* MENSAJE DE ERROR */}
          {errorValidacion && (
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorValidacion}
            </div>
          )}

          {/* BOTONES */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-secondary"
              disabled={indexCategoria === 0}
              onClick={handleAnterior}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Anterior
            </button>

            {indexCategoria < encuesta.categorias.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleSiguiente}
              >
                Siguiente
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            ) : (
              <button 
                className="btn btn-success"
                onClick={handleEnviar}
              >
                <i className="bi bi-check-circle me-2"></i>
                Enviar Encuesta
              </button>
            )}
          </div>
        </div>

        {/* Indicador de progreso de categorías */}
        <div className="text-center mt-3 text-muted">
          <small>
            Sección {indexCategoria + 1} de {encuesta.categorias.length}
          </small>
        </div>
      </div>

      {/* Modal de Éxito */}
      <Modal 
        show={mostrarModalExito} 
        centered
        backdrop="static"
        keyboard={false}
        className="modal-exito"
      >
        <Modal.Body className="text-center py-5">
          <div 
            className="mb-4 mx-auto"
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}
          >
            <i className="bi bi-check-circle-fill text-white" style={{ fontSize: '60px' }}></i>
          </div>
          
          <h2 className="mb-3 fw-bold text-success">¡Encuesta Enviada con Éxito!</h2>
          <p className="text-muted mb-4 fs-5">
            Gracias por completar la encuesta de <strong>{encuesta.asignatura}</strong>
          </p>
          <p className="text-muted">
            Tu opinión es muy importante para nosotros y nos ayuda a mejorar la calidad educativa.
          </p>
          
          <div className="my-4 p-3 bg-light rounded">
            <div 
              className="spinner-border spinner-border-sm text-primary me-2" 
              role="status"
            >
              <span className="visually-hidden">Redirigiendo...</span>
            </div>
            <span className="text-muted">
              Redirigiendo en <strong className="text-primary fs-4">{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}...
            </span>
          </div>
          
          <Button 
            variant="success" 
            size="lg"
            onClick={() => navigate('/alumno/completadas')}
            className="px-5 mt-3"
          >
            <i className="bi bi-list-check me-2"></i>
            Ver Mis Encuestas Completadas
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}