import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash, PersonCircle } from 'react-bootstrap-icons';
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

  const handleVolver = () => {
    navigate('/');
  };

  return (
    <div className="login-alumno-container">
      <Container className="login-alumno-wrapper">
        <Card className="login-alumno-card shadow-lg border-0">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="mb-3">
                <PersonCircle className="login-alumno-icon" />
              </div>
              <h2 className="login-alumno-title">Acceso de Alumno</h2>
              <p className="login-alumno-subtitle">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="login-alumno-form-group mb-3">
                <Form.Label className="login-alumno-label">
                  <i className="bi bi-person-fill me-2"></i>
                  Usuario
                </Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  placeholder="Ingresa tu usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  disabled={loading}
                  size="lg"
                />
              </Form.Group>

              <Form.Group className="login-alumno-form-group-last mb-4">
                <Form.Label className="login-alumno-label">
                  <i className="bi bi-lock-fill me-2"></i>
                  Contraseña
                </Form.Label>
                <InputGroup size="lg">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="clave"
                    placeholder="Ingresa tu contraseña"
                    value={formData.clave}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="login-alumno-button-group">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={handleVolver}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              <div className="login-alumno-footer-text">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  ¿Problemas para acceder? Contacta al departamento de alumnos
                </small>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Card className="login-alumno-info-card mt-4 shadow-sm">
          <Card.Body className="p-4">
            <h6 className="login-alumno-info-title">
              <i className="bi bi-lightbulb-fill text-warning me-2"></i>
              Información importante
            </h6>
            <ul className="login-alumno-info-list">
              <li className="login-alumno-info-item">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Usa tu usuario y contraseña institucional
              </li>
              <li className="login-alumno-info-item">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Completa todas las encuestas pendientes
              </li>
              <li className="login-alumno-info-item">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Tu opinión es importante para mejorar
              </li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};