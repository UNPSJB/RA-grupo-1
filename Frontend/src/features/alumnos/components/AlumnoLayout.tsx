import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Alumno.css"
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import { useEffect, useState } from "react";

interface AlumnoLayoutProps {
  children?: React.ReactNode;
}

export const AlumnoLayout = ({ children }: AlumnoLayoutProps) => {
  const navigate = useNavigate();
  const [alumnoInfo, setAlumnoInfo] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });

  useEffect(() => {
    // Cargar información del alumno desde localStorage
    const nombre = localStorage.getItem('alumno_nombre') || '';
    const apellido = localStorage.getItem('alumno_apellido') || '';
    const email = localStorage.getItem('alumno_email') || '';
    
    setAlumnoInfo({ nombre, apellido, email });
  }, []);

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('alumno_token');
    localStorage.removeItem('alumno_id');
    localStorage.removeItem('alumno_nombre');
    localStorage.removeItem('alumno_apellido');
    localStorage.removeItem('alumno_email');
    navigate('/');
  };

  const alumnoNavLinks = [
    { to: "/alumno/incompletas", label: "Encuestas Incompletas" },
    { to: "/alumno/completadas", label: "Encuestas Completadas" }
  ];

  return (
    <div className="alumno">
      <Navbar 
        navLinks={alumnoNavLinks}
        userInfo={{
          nombre: `${alumnoInfo.nombre} ${alumnoInfo.apellido}`,
          email: alumnoInfo.email
        }}
        onLogout={handleLogout}
      />
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