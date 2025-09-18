import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Schema.css";

interface SchemaProps {
  children?: React.ReactNode;
}

export default function Schema({ children }: SchemaProps) {
  return (
    <div className="schema">
      {/* Navigation Bar */}
      <Navbar bg="light" variant="light" expand="lg" className="shadow-sm navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold brand-custom d-flex align-items-center">
            <img 
              src="/src/assets/logo uni.png" 
              alt="UNPSJB Logo" 
              className="navbar-logo me-3"
            />
            Sistema de encuestas de la UNPSJB
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Encuestas Incompletas
              </Nav.Link>
              <Nav.Link as={Link} to="/otra-pagina" className="nav-link-custom">
                Siguiente
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="main-content">
        <Container className="content-container">
          <Outlet />
          {children}
        </Container>
      </main>

      {/* Footer */}
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