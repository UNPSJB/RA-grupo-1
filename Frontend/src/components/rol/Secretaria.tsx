// src/components/rol/Secretaria.tsx
import { Outlet, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

export default function Secretaria() {
  return (
    <div>
      <Navbar bg="light" expand="lg" className="shadow-sm mb-3">
        <Container>
          <Navbar.Brand>Secretaría Académica</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/secretaria/ciclos">Ciclos de Encuestas</Nav.Link>
            <Nav.Link as={Link} to="/secretaria/admin">Administración</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Aquí se renderizan las rutas hijas */}
        <Outlet />
      </Container>
    </div>
  );
}
