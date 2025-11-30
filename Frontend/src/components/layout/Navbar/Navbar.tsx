import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar as BSNavbar, Nav, Dropdown } from "react-bootstrap";
import { usePersona } from "../../../hooks/usePersona";
import './Navbar.css';

interface NavbarProps {
  navLinks?: Array<{
    to?: string;
    label: string;
    onClick?: () => void;
    dropdown?: Array<{ to: string; label: string }>;
  }>;
  showUserInfo?: boolean;
  rol?: string;
}

export const Navbar = ({
  navLinks = [],
  showUserInfo = true,
  rol = 'alumno'
}: NavbarProps) => {
  const { persona, nombreCompleto, loading, error } = usePersona(rol);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    navigate('/');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <BSNavbar bg="light" variant="light" expand="lg" className="shadow-sm navbar-custom">
      <Container>
        {/* Logo y nombre del sistema */}
        <BSNavbar.Brand className="fw-bold brand-custom d-flex align-items-center">
          <a 
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none d-flex align-items-center"
          >
            <img 
              src="/src/assets/logo_unpsjb.png" 
              alt="UNPSJB Logo" 
              className="navbar-logo"
            />
            {rol !== "departamento_alumnos" && (
              <span className="brand-text">Sistema de encuestas UNPSJB</span>
            )}
          </a>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">

          {/* Links de navegación */}
          {navLinks.length > 0 && (
            <Nav className="me-auto">
              {navLinks.map((link, index) => {
                if (link.dropdown) {
                  return (
                    <Dropdown key={index} className="me-2">
                      <Dropdown.Toggle 
                        variant="light"
                        id={`dropdown-${index}`}
                        className={`nav-link-custom ${rol === 'docente' ? 'docente-nav-link' : ''}`}
                      >
                        {link.label}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {link.dropdown.map((item, subIndex) => (
                          <Dropdown.Item 
                            key={subIndex} 
                            as={Link} 
                            to={item.to}
                            onClick={() => setShowDropdown(false)}
                          >
                            {item.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  );
                }

                return (
                  <Nav.Link 
                    key={index}
                    as={link.onClick ? 'button' : Link} 
                    to={link.onClick ? undefined : link.to} 
                    onClick={link.onClick} 
                    className={`nav-link-custom ${rol === 'docente' ? 'docente-nav-link' : ''}`}
                    style={link.onClick ? { cursor: 'pointer' } : {}}
                  >
                    {link.label}
                  </Nav.Link>
                );
              })}
            </Nav>
          )}

          {/* Información del usuario */}
          {showUserInfo && (
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
                  <span className="text-muted">{error}</span>
                </Nav.Item>
              ) : persona ? (
                <Dropdown 
                  show={showDropdown} 
                  onToggle={toggleDropdown}
                  align="end"
                >
                  <Dropdown.Toggle 
                    as={Nav.Link} 
                    className="user-dropdown-toggle p-0"
                    id="user-dropdown"
                  >
                    <div className="d-flex align-items-center user-profile cursor-pointer">
                      <div className="user-avatar me-3">
                        <img 
                          src="/src/assets/blank_profile.png" 
                          alt="Avatar del usuario" 
                          className="user-avatar-img"
                        />
                      </div>
                      <div className="user-name-display">
                        {nombreCompleto}
                        <small className="d-block text-muted" style={{fontSize: '0.8rem'}}>
                          {rol === 'docente' ? 'Docente' : 'Alumno'}
                        </small>
                      </div>
                      <i className="bi bi-chevron-down ms-2" style={{fontSize: '0.8rem'}}></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Header className="user-dropdown-header">
                      <div className="text-center">
                        <img 
                          src="/src/assets/blank_profile.png" 
                          alt="Avatar" 
                          className="dropdown-avatar mb-2"
                        />
                        <h6 className="mb-0">{nombreCompleto}</h6>
                        <small className="text-muted">{persona.email}</small>
                      </div>
                    </Dropdown.Header>

                    <Dropdown.Divider />

                    <Dropdown.Item 
                      className="dropdown-item-custom"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <i className="bi bi-person-circle text-muted me-2"></i>
                  <span className="text-muted">El usuario no se encontró</span>
                </Nav.Item>
              )}
            </Nav>
          )}
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};
