import { Routes, Route } from 'react-router-dom';
import { RoleSelection } from '../features/inicio/components/RoleSelection';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import { DetalleAsignatura} from '../features/docentes/components/DetalleAsignatura';
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento'
import { GestionPreguntas } from '../features/departamentos/components/GestionPreguntas';
import { GestionEncuestas } from '../features/departamentos/components/GestionEncuestas';
import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { CrearEncuesta } from '../features/secretaria/components/CrearEncuesta';
import { PanelEncuestas } from '../features/secretaria/components/PanelEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { CiclosPage } from "../features/ciclos/components/CiclosPage";
import { EncuestaCicloBasico } from '../features/encuestas/components/EncuestaCicloBasico';

//import SecretariaPreguntas from "../features/preguntas/components/SecretariaPreguntas";

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      <Route index element={<RoleSelection />} />
      
      <Route path="/alumno" element={<AlumnoLayout />}> 
        <Route path="asignaturas" element={<AsignaturasCursadas />} />
        <Route path="asignatura/:id" element={<AsignaturaDetalle />} />
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
        <Route path="encuesta/:encuestaId/encuesta" element={<EncuestaCicloBasico />} />
      </Route>
      
      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<PanelDocente />} /> 
        <Route path="reportes" element={<div>Reportes de Encuestas</div>} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />
        <Route path="asignatura/:asignaturaId" element={<DetalleAsignatura />} />
      </Route>

      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route index element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
      </Route>

      <Route path="/secretaria" element={<SecretariaLayout />}>
        <Route path="crear-encuesta" element={<CrearEncuesta />} />
        <Route path="estadisticas/:encuestaId" element={<EstadisticasEncuesta />} />
        <Route path="panel-encuestas" element={<PanelEncuestas />} />
        <Route index element={<CiclosPage />} />
        <Route path="ciclos" element={<CiclosPage />} />
      </Route>
    </Routes>
  );
}

export default App;