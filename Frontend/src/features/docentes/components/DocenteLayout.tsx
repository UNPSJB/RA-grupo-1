import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";

export const DocenteLayout = ({ children }) => {
  const docenteNavLinks = [
    { to: "/docente", label: "Panel Principal" },
    { to: "/docente/reportes", label: "Reportes" },
    { to: "/docente/mis-materias", label: "Mis Materias"}
  ];

  return (
    <div className="docente-layout">
      <Navbar navLinks={docenteNavLinks} />
      
      
      <main className="main-content">
        <Container className="content-container">
          <Outlet />
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
};