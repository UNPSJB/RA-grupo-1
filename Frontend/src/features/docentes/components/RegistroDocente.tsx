import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Eye, EyeSlash, XCircleFill, CheckCircleFill } from "react-bootstrap-icons";
import confetti from 'canvas-confetti';
import "../styles/RegistroDocente.css";

const logoUni = "/src/assets/logo_unpsjb.png";

export const RegistroDocente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
    legajo: "",
    CUIL: "",
    usuario: "",
    clave: "",
    repetirClave: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
      setShowErrorPopup(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setShowErrorPopup(true);
    
    setTimeout(() => {
      setShowErrorPopup(false);
    }, 5000);
  };

  const showSuccess = (nombre, apellido) => {
    setSuccessMessage(`¡Bienvenido ${nombre} ${apellido}!`);
    setShowSuccessPopup(true);
    
    // Efecto de confeti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#2B7CB8', '#FDB913', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ⭐ PROTECCIÓN ANTI DOBLE SUBMIT
  if (loading) return;
  setLoading(true);

  if (formData.clave !== formData.repetirClave) {
    showError("Las contraseñas no coinciden");
    setLoading(false);
    return;
  }

  if (formData.clave.length < 6) {
    showError("La contraseña debe tener al menos 6 caracteres");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/personas/registro-docente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        dni: formData.dni,
        legajo: formData.legajo,
        CUIL: formData.CUIL,
        usuario: formData.usuario,
        clave: formData.clave,
        rol_id: 2
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error en el registro");
    }

    showSuccess(data.nombre, data.apellido);

    setTimeout(() => {
      navigate("/docente/login");
    }, 3500);

  } catch (err) {
    showError(err.message || "Error al registrarse. Por favor, intenta nuevamente.");
  } finally {
    setLoading(false);
  }
};


  const goLogin = () => navigate("/docente/login");

  const closeErrorPopup = () => setShowErrorPopup(false);
  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/docente/login");
  };

  return (
    <div className="registro-docente-page">
      {/* Pop-up de Error */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup error-popup">
            <div className="popup-icon error-icon">
              <XCircleFill size={50} />
            </div>
            <h3 className="popup-title">¡Oops! Algo salió mal</h3>
            <p className="popup-message">{error}</p>
            <Button className="popup-btn error-btn" onClick={closeErrorPopup}>
              Entendido
            </Button>
          </div>
        </div>
      )}

      {/* Pop-up de Éxito */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup success-popup">
            <div className="popup-icon success-icon">
              <CheckCircleFill size={50} />
            </div>
            <h3 className="popup-title">¡Registro Exitoso!</h3>
            <p className="popup-message">{successMessage}</p>
            <p className="popup-submessage">Serás redirigido al inicio de sesión...</p>
            <Button className="popup-btn success-btn" onClick={closeSuccessPopup}>
              Ir al Login
            </Button>
          </div>
        </div>
      )}

      {/* Header con botón de Login */}
      <div className="registro-header fade-in">
        <span className="text-white me-2 d-none d-sm-inline">¿Ya tienes cuenta?</span>
        <Button className="registro-login-btn" onClick={goLogin}>
          Iniciar Sesión
        </Button>
      </div>

      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1 fade-in-up">
        
        <div className="registro-title-section text-center mb-2">
          <h6 className="registro-main-title">Registro de Docente</h6>
        </div>

        <Card className="registro-card shadow-lg">
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>

              {/* Fila 1: Nombre y Apellido */}
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Label className="registro-label">Nombre *</Form.Label>
                  <Form.Control 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                    className="registro-input"
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label className="registro-label">Apellido *</Form.Label>
                  <Form.Control 
                    name="apellido" 
                    value={formData.apellido} 
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className="registro-input"
                  />
                </div>
              </div>

              {/* Fila 2: Email y DNI */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Label className="registro-label">Email *</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    required
                    placeholder="juan.perez@example.com"
                    className="registro-input"
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label className="registro-label">DNI *</Form.Label>
                  <Form.Control 
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange}
                    required
                    placeholder="12345678"
                    maxLength={10}
                    className="registro-input"
                  />
                </div>
              </div>

              {/* Fila 3: Legajo y CUIL */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Label className="registro-label">Legajo *</Form.Label>
                  <Form.Control 
                    name="legajo" 
                    value={formData.legajo} 
                    onChange={handleChange}
                    required
                    placeholder="2024001"
                    className="registro-input"
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label className="registro-label">CUIL *</Form.Label>
                  <Form.Control 
                    name="CUIL" 
                    value={formData.CUIL} 
                    onChange={handleChange}
                    required
                    placeholder="20-12345678-9"
                    className="registro-input"
                  />
                </div>
              </div>

              {/* Fila 4: Usuario */}
              <div className="row g-3 mt-1">
                <div className="col-12">
                  <Form.Label className="registro-label">Usuario *</Form.Label>
                  <Form.Control 
                    name="usuario" 
                    placeholder="juan.perez" 
                    value={formData.usuario} 
                    onChange={handleChange}
                    required
                    className="registro-input"
                  />
                  <Form.Text className="text-muted small">
                    Este será tu usuario para iniciar sesión
                  </Form.Text>
                </div>
              </div>

              {/* Fila 5: Contraseñas */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Form.Label className="registro-label">Contraseña *</Form.Label>
                  <div className="password-container">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="clave"
                      value={formData.clave}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="registro-input-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <Form.Label className="registro-label">Repetir Contraseña *</Form.Label>
                  <div className="password-container">
                    <Form.Control
                      type={showPassword2 ? "text" : "password"}
                      name="repetirClave"
                      value={formData.repetirClave}
                      onChange={handleChange}
                      required
                      placeholder="Confirma tu contraseña"
                      className="registro-input-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword2(!showPassword2)}
                    >
                      {showPassword2 ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="registro-submit-btn w-100 mt-4" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registrando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>

            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};