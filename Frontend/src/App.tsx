import { Routes, Route } from "react-router-dom";
import Alumno from "./components/rol/Alumno";
import Docente from "./components/rol/Docente";
import Departamento from "./components/rol/Departamento";
import Secretaria from "./components/rol/Secretaria";

import RoleSelection from "./components/inicio/RoleSelection";
import EncuestasIncompletas from "./components/encuesta/EncuestasIncompletas";
import EncuestasCompletas from "./components/encuesta/EncuestasCompletas";
import CiclosPage from "./components/secretaria/CiclosPage";

import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Routes>
      <Route index element={<RoleSelection />} />

      {/* Alumno */}
      <Route path="/alumno" element={<Alumno />}>
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
      </Route>

      {/* Docente */}
      <Route path="/docente" element={<Docente />}>
        <Route path="reportes" element={<div>Reportes de Docente</div>} />
      </Route>

      {/* Departamento */}
      <Route path="/departamento" element={<Departamento />}>
        <Route path="gestion" element={<div>Gestión de Departamento</div>} />
      </Route>

      {/* Secretaría */}
      <Route path="/secretaria" element={<Secretaria />}>
        {/* Ruta index para /secretaria */}
        <Route index element={<div>Bienvenido a Secretaría</div>} />
        <Route path="ciclos" element={<CiclosPage />} />
        <Route path="admin" element={<div>Administración Secretaría</div>} />
      </Route>
    </Routes>
  );
}

export default App;
