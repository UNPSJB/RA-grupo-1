import { Container, Row, Col } from "react-bootstrap";
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <Container>
        <Row className="align-items-center justify-content-center text-center">
          <Col md={12}>
            {/* Identidad Institucional */}
            <div className="footer-brand mb-3">
              <p className="footer-title mb-1">
                © 2025 Universidad Nacional de la Patagonia San Juan Bosco
              </p>
              <div className="footer-divider"></div>
            </div>
      
            {/* Redes Sociales y Web */}
            <div className="footer-socials">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/unpsjb?locale=es_LA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook" 
                title="Facebook Oficial"
              >
                <i className="bi bi-facebook"></i>
              </a>

              {/* Sitio Web (Nuevo Cambio) */}
              <a 
                href="https://www.unp.edu.ar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link website" 
                title="Sitio Web Institucional"
              >
                <i className="bi bi-globe"></i>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/unpsjb_oficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram" 
                title="Instagram Oficial"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};