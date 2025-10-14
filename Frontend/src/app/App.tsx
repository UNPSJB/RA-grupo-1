import { Routes, Route } from 'react-router-dom';
import { RoleSelection } from '../features/inicio/components/RoleSelection';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import { MisMaterias } from '../features/docentes/components/MisMaterias';
import { DetalleMateria } from '../features/docentes/components/DetalleMateria';
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { GestionPreguntas } from '../features/departamentos/components/GestionPreguntas';
import { GestionEncuestas } from '../features/departamentos/components/GestionEncuestas';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      <Route index element={<RoleSelection />} />
      
      <Route path="/alumno" element={<AlumnoLayout />}> 
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
      </Route>
      
      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<PanelDocente />} /> 
        <Route path="reportes" element={<div>Reportes de Encuestas</div>} />
        <Route path="mis-materias" element={<MisMaterias />} />
        <Route path="materia/:materiaId" element={<DetalleMateria />} />
      </Route>

      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
      </Route>
    </Routes>
  );
}

export default App;