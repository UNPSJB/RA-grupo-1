import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { EyeSlash, Eye, XCircleFill } from 'react-bootstrap-icons';
import '../styles/LoginAlumno.css';

const logoUni = "/src/assets/logo_unpsjb.png"; 

export const LoginAlumno = () => {
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
    setError('');
    setShowErrorPopup(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: formData.usuario,
          clave: formData.clave,
          rol_esperado: 'alumno'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Usuario o contraseña incorrectos');
      }

      localStorage.setItem('alumno_token', data.token || 'authenticated');
      localStorage.setItem('alumno_id', data.alumno_id.toString());
      localStorage.setItem('alumno_nombre', data.nombre);
      localStorage.setItem('alumno_apellido', data.apellido);
      localStorage.setItem('alumno_email', data.email);

      navigate('/alumno/panel');
    } catch (err) {
      console.error('Error en login:', err);
      showError(err.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarse = () => {
    navigate('/registro');
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="login-alumno-page">
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

      <div className="login-alumno-header fade-in">
        <span className="text-white me-2 d-none d-sm-inline">¿No tienes cuenta?</span>
        <Button 
          className="login-alumno-register-btn"
          onClick={handleRegistrarse}
        >
          Registrarse
        </Button>
      </div>

      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1 fade-in-up">
        
        <div className="login-alumno-title-section text-center mb-1">
          <h6 className="login-alumno-main-title">Portal de Alumnos</h6>
        </div>

        <Card className="login-alumno-card shadow-lg">
          <Card.Body className="p-4 p-md-4">
            <Form onSubmit={handleSubmit}>
              <div className="login-alumno-icon-container text-center mb-1">
                <img 
                  src={logoUni}
                  alt="UNPSJB Logo"
                  className="login-alumno-logo"
                />
              </div>
              
              <Form.Group className="mb-2">
                <Form.Label className="login-alumno-form-label">
                  Nombre de Usuario 
                </Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  placeholder="Ej. juan.perez"
                  value={formData.usuario}
                  onChange={handleChange}
                  disabled={loading}
                  className="login-alumno-input"
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="login-alumno-form-label">
                  Contraseña
                </Form.Label>

                <div className="login-alumno-password-container">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="clave"
                    placeholder="••••••••"
                    value={formData.clave}
                    onChange={handleChange}
                    disabled={loading}
                    className="login-alumno-input-password"
                  />
                  <button
                    type="button"
                    className="login-alumno-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="login-alumno-submit-btn w-100"
                disabled={loading}
              >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Ingresando...
                    </>
                ) : 'Iniciar Sesión'}
              </Button>

              <div className="login-alumno-forgot-password mt-3">
                <a href="#" className="login-alumno-forgot-link">
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