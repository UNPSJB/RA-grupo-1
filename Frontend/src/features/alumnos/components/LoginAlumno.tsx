import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { EyeSlash, Eye } from 'react-bootstrap-icons';
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.usuario || !formData.clave) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

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
        throw new Error(data.detail || 'Credenciales inválidas');
      }

      localStorage.setItem('alumno_token', data.token || 'authenticated');
      localStorage.setItem('alumno_id', data.alumno_id.toString());
      localStorage.setItem('alumno_nombre', data.nombre);
      localStorage.setItem('alumno_apellido', data.apellido);
      localStorage.setItem('alumno_email', data.email);

      navigate('/alumno/incompletas');
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarse = () => {
    navigate('/registro');
  };

  return (
    <div className="login-alumno-page">

      <div className="login-alumno-header fade-in">
        <span className="text-white me-3 d-none d-sm-inline">¿No tienes cuenta?</span>
        <Button 
          className="login-alumno-register-btn"
          onClick={handleRegistrarse}
        >
          Registrarse
        </Button>
      </div>

      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1 fade-in-up">
        
        <div className="login-alumno-title-section text-center mb-4">
          <h1 className="login-alumno-main-title">Portal de Alumnos</h1>
          <p className="login-alumno-main-subtitle">
            Ingresa tus credenciales institucionales
          </p>
        </div>

        <Card className="login-alumno-card shadow-lg">
          <Card.Body className="p-4 p-md-5">

            <div className="login-alumno-icon-container text-center mb-4">
              <img 
                src={logoUni}
                alt="UNPSJB Logo"
                className="login-alumno-logo"
              />
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3 fs-6">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
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

              <Form.Group className="mb-4">
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
                    tabIndex="-1" 
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