import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Docente.css"
import { usePersona } from "../../../hooks/usePersona";

interface DocenteLayout {
  children?: React.ReactNode;
}

export const DocenteLayout = ({ children }: DocenteLayout) => {
  const { persona, loading, error } = usePersona();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="docente">
      <main className="main-content">
        <Container fluid className="content-container">
          <Outlet />
          {children}
        </Container>
      </main>
    </div>
  );
}