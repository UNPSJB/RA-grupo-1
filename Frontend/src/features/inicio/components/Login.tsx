import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import "../styles/Login.css"; 

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Completa ambos campos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      auth.login({
        token: data.access_token,
        role: data.role,
        user_id: data.user_id,
        persona: { id: data.user_id, nombre: data.username ?? "", apellido: "" , email: data.email },
        alumno_id: data.alumno_id ?? null,
        docente_id: data.docente_id ?? null,
        departamento_id: data.departamento_id ?? null,
      });

    } catch (err: any) {
      setError(err.message ?? "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-alumno-page">
      <div className="login-alumno-header">
        <Button
          className="login-alumno-register-btn"
          onClick={() => navigate("/registro")}
        >
          Registrarte
        </Button>
      </div>

      <Container className="d-flex align-items-center justify-content-center min-vh-100 fade-in-up">
        <Card className="login-alumno-card">
          <Card.Body>
            <h3 className="mb-3 text-center">Ingresar</h3>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label className="login-alumno-form-label">Usuario</Form.Label>
                <Form.Control
                  className="login-alumno-input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="login-alumno-form-label">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  className="login-alumno-input-password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Button
                type="submit"
                className="login-alumno-submit-btn w-100"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
