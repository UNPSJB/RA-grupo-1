import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Alumno.css";
import { usePersona } from "../hooks/usePersona";

interface alumnoProps {
  children?: React.ReactNode;
}

export default function Alumno({ children }: AlumnoProps) {
  const { persona, loading, error } = usePersona();

  return (
    <div className="alumno">
      <Navbar bg="light" variant="light" expand="lg" className="shadow-sm navbar-custom">
        <Container>
         <Navbar.Brand className="fw-bold brand-custom d-flex align-items-center">
  <a 
    href="https://www.unp.edu.ar/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-decoration-none d-flex align-items-center"
  >
    <img 
      src="/src/assets/logo uni.png" 
      alt="UNPSJB Logo" 
      className="navbar-logo me-3"
    />
    Sistema de encuestas de la UNPSJB
  </a>
</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/alumno/incompletas" className="nav-link-custom">
                Encuestas Incompletas
              </Nav.Link>
              <Nav.Link as={Link} to="/alumno/completadas" className="nav-link-custom">
                Encuestas Completadas 
              </Nav.Link>
            </Nav>
            
            <Nav className="ms-auto">
              {loading ? (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <span className="text-muted">Cargando...</span>
                </Nav.Item>
              ) : error ? (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                  <span className="text-muted">Error</span>
                </Nav.Item>
              ) : persona ? (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <div className="user-avatar me-3">
                    <img 
                      src="/src/assets/blank_profile.png" 
                      alt="Avatar del usuario" 
                      className="user-avatar-img"
                    />
                  </div>
                  <div className="user-name-display">
                    {persona.nombre}
                  </div>
                </Nav.Item>
              ) : (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <i className="bi bi-person-circle text-muted me-2"></i>
                  <span className="text-muted">El usuario no se encontro</span>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="main-content">
        <Container className="content-container">
          <Outlet />
          {children}
        </Container>
      </main>

      <footer className="footer">
        <Container>
          <div className="footer-content">
            <p className="footer-title">
              © 2025 Universidad Nacional de la Patagonia San Juan Bosco
            </p>
            <small className="footer-subtitle">
              Sistema desarrollado como parte de la ISFPP - Desarrollo de Software
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
}