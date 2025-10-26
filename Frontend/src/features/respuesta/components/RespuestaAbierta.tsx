import React, { useState } from 'react';
import { Form, Button, Card, Badge, Alert } from 'react-bootstrap';

interface Pregunta {
  id: number;
  texto: string;
  tipo: string;
  opciones?: any[];
}

interface Props {
  pregunta: Pregunta;
  formularioId: number | null;
  onRespuestaEnviada: (preguntaId: number) => void;
}

function ResponderPreguntaAbierta({ pregunta, formularioId, onRespuestaEnviada }: Props) {
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState<'success' | 'danger'>('success');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!textoRespuesta.trim()) {
      setMensaje('Por favor, escriba su respuesta.');
      setTipoAlerta('danger');
      setMostrarAlerta(true);
      return;
    }

    // se necesita formularioId
    if (!formularioId) {
      setMensaje('Error: No se ha inicializado el formulario.');
      setTipoAlerta('danger');
      setMostrarAlerta(true);
      return;
    }

    const nuevaRespuesta = {
      texto: textoRespuesta,
      pregunta_id: pregunta.id,
      opcion_id: null,
      formulario_id: formularioId // se necesita formularioId
    };

    setEnviando(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/respuestas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaRespuesta),
      });

      if (response.ok) {
        setMensaje('Respuesta enviada con éxito');
        setTipoAlerta('success');
        setMostrarAlerta(true);
        setTextoRespuesta('');
        onRespuestaEnviada(pregunta.id);
        
        // Ocultar alerta despues de 3 seg
        setTimeout(() => setMostrarAlerta(false), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMensaje(`Error al enviar la respuesta: ${errorData.detail || 'Error del servidor'}`);
        setTipoAlerta('danger');
        setMostrarAlerta(true);
      }
    } catch (error) {
      setMensaje('Error de conexión.'); // Verificar backend si no fucniona
      setTipoAlerta('danger');
      setMostrarAlerta(true);
      console.error('Error de conexión:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '0.75rem' }}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <Badge 
              bg="primary"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}
            >
              <i className="fa-solid fa-question"></i>
            </Badge>
            <Badge 
              bg="success" 
              className="px-2 py-1"
              style={{ fontSize: "0.75rem" }}
            >
              Pregunta Abierta
            </Badge>
          </div>
          {!formularioId && (
            <Badge bg="warning" className="px-2 py-1" style={{ fontSize: "0.75rem" }}>
              Formulario no inicializado o inexistente
            </Badge>
          )}
        </div>

        <h5 
          className="fw-semibold mb-3" 
          style={{ 
            color: "#1f2937", 
            fontSize: "1.1rem", 
            lineHeight: "1.4",
            minHeight: "3rem"
          }}
        >
          {pregunta.texto}
        </h5>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label 
              className="fw-semibold mb-2" 
              style={{ fontSize: "0.875rem", color: "#4b5563" }}
            >
              Su respuesta:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={textoRespuesta}
              onChange={(e) => setTextoRespuesta(e.target.value)}
              placeholder="Escriba su respuesta aquí..."
              className="border-2"
              style={{
                borderColor: "#e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                padding: "0.75rem 1rem",
                resize: "vertical",
                minHeight: "120px"
              }}
              disabled={!formularioId || enviando}
            />
            {!formularioId && (
              <Form.Text className="text-warning">
                <i className="fas fa-exclamation-triangle me-1"></i>
                Esperando inicialización del formulario...
              </Form.Text>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              type="submit"
              className="px-4 py-2 d-flex align-items-center gap-2"
              style={{ borderRadius: '0.5rem' }}
              disabled={!formularioId || !textoRespuesta.trim() || enviando}
            >
              {enviando ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Enviando...</span>
                  </div>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Enviar Respuesta
                </>
              )}
            </Button>
          </div>
        </Form>

        {mostrarAlerta && (
          <Alert 
            variant={tipoAlerta} 
            className="mt-3 d-flex align-items-center justify-content-between"
            style={{ borderRadius: '0.5rem' }}
          >
            <span className="flex-grow-1">
              <i className={`fas ${tipoAlerta === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
              {mensaje}
            </span>
            <Button 
              variant={`outline-${tipoAlerta}`} 
              size="sm" 
              onClick={() => setMostrarAlerta(false)}
              className="border-0 ms-2"
              style={{ minWidth: '30px' }}
            >
              <i className="fas fa-times"></i>
            </Button>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default ResponderPreguntaAbierta;