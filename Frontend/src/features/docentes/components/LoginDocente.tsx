import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { EyeSlash, Eye, XCircleFill } from 'react-bootstrap-icons';
import '../styles/LoginDocente.css';

const logoUni = "/src/assets/logo_unpsjb.png"; 

export const LoginDocente = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    usuario: '',
    clave: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
      setShowErrorPopup(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setShowErrorPopup(true);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setShowErrorPopup(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.usuario || !formData.clave) {
    showError('Por favor, completa todos los campos');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:8000/auth/login-docente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Usuario o contraseña incorrectos');
    }

    localStorage.setItem('docente_token', data.token);
    localStorage.setItem('docente_id', data.docente_id);
    localStorage.setItem('docente_nombre', data.nombre);
    localStorage.setItem('docente_apellido', data.apellido);
    localStorage.setItem('docente_email', data.email);

    navigate('/docente/panel');

  } catch (err) {
    console.error('Error en login:', err);
    showError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleRegistrarse = () => {
    navigate('/docente/registro');
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="login-docente-page">
      {/* Pop-up de Error Moderno */}
      {showErrorPopup && (
        <div className="error-popup-overlay">
          <div className="error-popup">
            <div className="error-popup-icon">
              <XCircleFill size={50} />
            </div>
            <h3 className="error-popup-title">¡Oops! Algo salió mal</h3>
            <p className="error-popup-message">{error}</p>
            <Button 
              className="error-popup-btn"
              onClick={closeErrorPopup}
            >
              Entendido
            </Button>
          </div>
        </div>
      )}

      <div className="login-docente-header fade-in">
        <span className="text-white me-2 d-none d-sm-inline">¿No tienes cuenta?</span>
        <Button 
          className="login-docente-register-btn"
          onClick={handleRegistrarse}
        >
          Registrarse
        </Button>
      </div>

      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1 fade-in-up">
        
        <div className="login-docente-title-section text-center mb-1">
          <h6 className="login-docente-main-title">Portal de Docentes</h6>
        </div>

        <Card className="login-docente-card shadow-lg">
          <Card.Body className="p-4 p-md-4">
            <Form onSubmit={handleSubmit}>
              <div className="login-docente-icon-container text-center mb-1">
                <img 
                  src={logoUni}
                  alt="UNPSJB Logo"
                  className="login-docente-logo"
                />
              </div>
              
              <Form.Group className="mb-2">
                <Form.Label className="login-docente-form-label">
                  Nombre de Usuario 
                </Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  placeholder="Ej. juan.perez"
                  value={formData.usuario}
                  onChange={handleChange}
                  disabled={loading}
                  className="login-docente-input"
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="login-docente-form-label">
                  Contraseña
                </Form.Label>

                <div className="login-docente-password-container">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="clave"
                    placeholder="••••••••"
                    value={formData.clave}
                    onChange={handleChange}
                    disabled={loading}
                    className="login-docente-input-password"
                  />
                  <button
                    type="button"
                    className="login-docente-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="login-docente-submit-btn w-100"
                disabled={loading}
              >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Ingresando...
                    </>
                ) : 'Iniciar Sesión'}
              </Button>

              <div className="login-docente-forgot-password mt-3">
                <a href="#" className="login-docente-forgot-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};