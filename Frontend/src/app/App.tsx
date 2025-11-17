import { Routes, Route } from 'react-router-dom';
import { RoleSelection } from '../features/inicio/components/RoleSelection';
import { LoginAlumno } from '../features/alumnos/components/LoginAlumno';
import { PanelAlumno } from '../features/alumnos/components/PanelAlumno';
import { ProtectedRoute } from '../features/alumnos/components/ProtectedRoute';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento';
import { GestionPreguntas } from '../features/departamentos/components/GestionPreguntas';
import { GestionEncuestas } from '../features/departamentos/components/GestionEncuestas';

import InformeSinteticoCabeceraPage from '../features/departamentos/pages/InformeSinteticoCabeceraPage';

import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { CrearEncuesta } from '../features/secretaria/components/CrearEncuesta';
import { PanelEncuestas } from '../features/secretaria/components/PanelEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { CiclosPage } from "../features/ciclos/components/CiclosPage";

import DetalleEncuesta from '../features/encuestas/components/DetalleEncuesta';
import { NuevaEncuesta } from '../features/secretaria/components/NuevaEncuesta';
import CompletarEncuesta from "../features/encuestas/components/CompletarEncuesta";

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route index element={<RoleSelection />} />

      {/* Login alumno */}
      <Route path="/alumno/login" element={<LoginAlumno />} />
      
      {/* Rutas de alumno (PROTEGIDAS) */}
        <Route 
          path="/alumno" 
          element={
            <ProtectedRoute>
              <AlumnoLayout />
            </ProtectedRoute>
          }
        > 
          <Route path="panel" element={<PanelAlumno />} />
          <Route path="asignaturas" element={<AsignaturasCursadas />} />
          <Route path="asignatura/:id" element={<AsignaturaDetalle />} />
          <Route path="incompletas" element={<EncuestasIncompletas />} />
          <Route path="encuestas/:encuestaId/completar" element={<CompletarEncuesta />} />
          <Route path="completadas" element={<EncuestasCompletas />} />
          <Route path="encuesta/:id" element={<DetalleEncuesta />} />
        </Route>
      
      {/* Rutas de docente */}
      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<PanelDocente />} />
        <Route path="reportes" element={<div>Reportes de Encuestas</div>} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />
      </Route>

      {/* Rutas departamento */}
      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route index element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />

        {/*NUEVAS RUTAS DEL INFORME SINTETICO*/}
        <Route 
          path="informe-sintetico/cabecera" 
          element={<InformeSinteticoCabeceraPage />} 
        />
        <Route 
          path="informe-sintetico/preguntas" 
          element={<div>Preguntas del informe (en desarrollo)</div>} 
        />
      </Route>

      {/* Rutas secretaría */}
      <Route path="/secretaria" element={<SecretariaLayout />}>
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
        <Route path="estadisticas/:encuestaId" element={<EstadisticasEncuesta />} />
        <Route path="ciclos" element={<CiclosPage />} />
        <Route path="/secretaria/nueva-encuesta" element={<NuevaEncuesta />} />
      </Route>
    </Routes>
  );
}

export default App;
