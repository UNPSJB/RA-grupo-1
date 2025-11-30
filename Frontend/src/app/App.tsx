import { Routes, Route } from 'react-router-dom';
import { RoleSelection } from '../features/inicio/components/RoleSelection';
import { LoginAlumno } from '../features/alumnos/components/LoginAlumno';
import { PanelAlumno } from '../features/alumnos/components/PanelAlumno';
import { ProtectedRoute } from '../features/alumnos/components/ProtectedRoute';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { ReporteDocente }  from '../features/docentes/components/ReporteDocente';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import InformeCatedraDetalle from "../features/informeCatedra/components/InformeCatedraDetalle";
import InformeFinalizadoDetalle from "../features/informeCatedra/informeCatedraTerminado/components/InformeFinalizadoDetalle";
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento';
import { GestionPreguntas } from '../features/secretaria/components/GestionPreguntas';
import { GestionEncuestas } from '../features/secretaria/components/GestionEncuestas';
import { RegistroAlumno } from "../features/alumnos/components/RegistroAlumno";

import InformeSinteticoCabeceraPage from '../features/departamentos/pages/InformeSinteticoCabeceraPage';
import InformeSinteticoPreguntasPage from '../features/departamentos/pages/InformeSinteticoPreguntasPage';
import InformeSinteticoGuardadoPage from '../features/departamentos/pages/InformeSinteticoGuardadoPage';

import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { CrearEncuesta } from '../features/secretaria/components/CrearEncuesta';
import { PanelEncuestas } from '../features/secretaria/components/PanelEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { CiclosPage } from "../features/ciclos/components/CiclosPage";
import { InformesFinalizados } from '../features/docentes/components/InformesFinalizados';
import DetalleEncuesta from '../features/encuestas/components/DetalleEncuesta';
import { NuevaEncuesta } from '../features/secretaria/components/NuevaEncuesta';
import CompletarEncuesta from "../features/encuestas/components/CompletarEncuesta";
import InformeSinteticoHistoricosPage from "../features/departamentos/pages/InformeSinteticoHistoricosPage";

//Import que agregamos
import VerEncuestaCompleta from '../features/encuestasCompletadas/components/VerEncuestaCompleta';

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
      <Route path="/registro" element={<RegistroAlumno />} />
      
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
        <Route path="completadas/:id" element={<VerEncuestaCompleta />} />
      </Route>
      
      {/* Rutas de docente */}
      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<PanelDocente />} />
        <Route path="reportes" element={<ReporteDocente />} />
        <Route path="informes-finalizados" element={<InformesFinalizados />} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />
        <Route
          path="informes-catedra/completar/:finalizadoId/:plantillaId"
          element={<InformeCatedraDetalle />}
        />
        <Route
          path="informes-catedra/ver/:finalizadoId/:plantillaId"
          element={<InformeFinalizadoDetalle />}
        />
      </Route>

      {/* Rutas de departamento */}
      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route path="historicos" element={<InformeSinteticoHistoricosPage />} />
        <Route path="informes/sinteticos" element={<PanelDepartamento />} />
        <Route path="informes/carreras" element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
        <Route 
          path="informe-sintetico/cabecera" 
          element={<InformeSinteticoCabeceraPage />} 
        />
        <Route 
          path="informe-sintetico/preguntas" 
          element={<InformeSinteticoPreguntasPage />} 
        />
        {/* */}
        <Route
          path="informe-sintetico/guardado/:id"
          element={<InformeSinteticoGuardadoPage />}
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
