import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Alumno.css"
import { usePersona } from "../../../hooks/usePersona";
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";

interface AlumnoLayoutProps {
  children?: React.ReactNode;
}

export const AlumnoLayout = ({ children }: AlumnoLayoutProps) => {
  const { persona, loading, error } = usePersona();

  const alumnoNavLinks = [
    { to: "/alumno/incompletas", label: "Encuestas Incompletas" },
    { to: "/alumno/completadas", label: "Encuestas Completadas" }
  ];

  return (
    <div className="alumno">
      <Navbar navLinks={alumnoNavLinks} />
      <main className="main-content">
        <Container className="content-container">
          <Outlet />
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}