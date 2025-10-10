 <Navbar bg="light" variant="light" expand="lg" className="shadow-sm navbar-custom">
        <Container>
          <Navbar.Brand className="fw-bold brand-custom d-flex align-items-center">
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none d-flex align-items-center"
            >
              <img 
                src="/src/assets/logo uni.png" 
                alt="UNPSJB Logo" 
                className="navbar-logo me-3"
              />
              Panel del docente
            </a>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Pestañas de Navegación */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/docente" className="nav-link-custom">
                <i className="bi bi-house me-1"></i>
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/docente/materias" className="nav-link-custom">
                <i className="bi bi-journal-text me-1"></i>
                Mis Materias
              </Nav.Link>
              <Nav.Link as={Link} to="/docente/reportes" className="nav-link-custom">
                <i className="bi bi-graph-up me-1"></i>
                Reportes
              </Nav.Link>
            </Nav>
            
            {/* Perfil del Usuario con Dropdown */}
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
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-user" 
                    className="user-profile-dropdown d-flex align-items-center border-0"
                  >
                    <div className="user-avatar me-2">
                      <img 
                        src="/src/assets/blank_profile.png" 
                        alt="Avatar del docente" 
                        className="user-avatar-img"
                      />
                    </div>
                    <div className="user-info text-start">
                      <div className="user-name-display fw-semibold">
                        {persona.nombre} {persona.apellido}
                      </div>
                      <small className="user-role text-muted">
                        Docente
                      </small>
                    </div>
                    <i className="bi bi-chevron-down ms-2 small"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <Dropdown.Header>
                      <div className="fw-semibold">{persona.nombre} {persona.apellido}</div>
                      <small className="text-muted">Legajo: {persona.legajo || '12345'}</small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/docente/perfil" className="dropdown-item-custom">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/docente/configuracion" className="dropdown-item-custom">
                      <i className="bi bi-gear me-2"></i>
                      Configuración
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={handleLogout} 
                      className="dropdown-item-custom text-danger"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Item className="d-flex align-items-center user-profile">
                  <i className="bi bi-person-circle text-muted me-2"></i>
                  <span className="text-muted">Usuario no encontrado</span>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>