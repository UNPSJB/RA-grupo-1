import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { EyeSlash, Eye } from 'react-bootstrap-icons';
import '../styles/LoginAlumno.css';

export const LoginAlumno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    clave: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (err: any) {
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

      <div className="login-alumno-header">
        <Button 
          variant="link" 
          className="login-alumno-register-btn"
          onClick={handleRegistrarse}
        >
          Registrarse
        </Button>
      </div>

      <div className="login-alumno-title-section">
        <h1 className="login-alumno-main-title">Iniciar Sesión</h1>
        <p className="login-alumno-main-subtitle">
          Ingresa tu nombre de usuario y contraseña para poder acceder al sitio.
        </p>
      </div>

      <Container className="login-alumno-form-container">
        <Card className="login-alumno-card">
          <Card.Body className="login-alumno-card-body">

            {/* 🔵 Imagen del logo en lugar del ícono */}
            <div className="login-alumno-icon-container">
              <img 
                src="/src/assets/logo_unpsjb.png"
                alt="UNPSJB Logo"
                className="login-alumno-logo"
              />
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="login-alumno-form-label">
                  Nombre de Usuario 
                </Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  disabled={loading}
                  className="login-alumno-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="login-alumno-form-label">
                  Contraseña
                </Form.Label>

                <div className="login-alumno-password-container">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="clave"
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
                className="login-alumno-submit-btn"
                disabled={loading}
              >
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="login-alumno-forgot-password">
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
