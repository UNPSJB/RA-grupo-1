import { Link } from "react-router-dom";
import { Container, Navbar as BSNavbar, Nav } from "react-bootstrap";
import { usePersona } from "../../../hooks/usePersona";
import './Navbar.css';

interface NavbarProps {
  navLinks?: Array<{
    to: string;
    label: string;
  }>;
}

export const Navbar = ({ navLinks = [] }: NavbarProps) => {
  const { persona, loading, error } = usePersona();

  return (
    <BSNavbar bg="light" variant="light" expand="lg" className="shadow-sm navbar-custom">
      <Container>
        <BSNavbar.Brand className="fw-bold brand-custom d-flex align-items-center">
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
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Links de navegación dinámicos */}
          {navLinks.length > 0 && (
            <Nav className="me-auto">
              {navLinks.map((link) => (
                <Nav.Link 
                  key={link.to}
                  as={Link} 
                  to={link.to} 
                  className="nav-link-custom"
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          )}
          
          {/* Información del usuario */}
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
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};