import { Routes, Route } from 'react-router-dom';

import { RoleSelection } from '../features/inicio/components/RoleSelection';

// Alumno
import { LoginAlumno } from '../features/alumnos/components/LoginAlumno';
import { RegistroAlumno } from "../features/alumnos/components/RegistroAlumno";
import { ProtectedRoute } from '../features/alumnos/components/ProtectedRoute';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { PanelAlumno } from '../features/alumnos/components/PanelAlumno';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import DetalleEncuesta from '../features/encuestas/components/DetalleEncuesta';
import CompletarEncuesta from "../features/encuestas/components/CompletarEncuesta";
import VerEncuestaCompleta from '../features/encuestasCompletadas/components/VerEncuestaCompleta';

// Docente
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import { ReporteDocente } from '../features/docentes/components/ReporteDocente';
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import InformesPendientesLista from "../features/docentes/informe/components/InformesPendientesLista";
import CompletarInformeCatedra from "../features/docentes/informe/components/CompletarInformeCatedra";
import InformeCatedraDetalle from "../features/informeCatedra/components/InformeCatedraDetalle";
import InformeFinalizadoDetalle from "../features/informeCatedra/informeCatedraTerminado/components/InformeFinalizadoDetalle";
import { InformesFinalizados } from '../features/docentes/components/InformesFinalizados';

// Departamento
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento';
import InformeSinteticoCabeceraPage from '../features/departamentos/pages/InformeSinteticoCabeceraPage';
import InformeSinteticoPreguntasPage from '../features/departamentos/pages/InformeSinteticoPreguntasPage';
import InformeSinteticoGuardadoPage from '../features/departamentos/pages/InformeSinteticoGuardadoPage';
import InformeSinteticoHistoricosPage from "../features/departamentos/pages/InformeSinteticoHistoricosPage";

// Secretaría
import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { GestionPreguntas } from '../features/secretaria/components/GestionPreguntas';
import { GestionEncuestas } from '../features/secretaria/components/GestionEncuestas';
import { CrearEncuesta } from '../features/secretaria/components/CrearEncuesta'; // vieja
import { PanelEncuestas } from '../features/secretaria/components/PanelEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { NuevaEncuesta } from '../features/secretaria/components/NuevaEncuesta';
import InformesSinteticosLista from "../features/secretaria/components/InformesSinteticosLista";
import DetalleInformeSinteticoSecretaria from "../features/secretaria/pages/DetalleInformeSinteticoSecretaria";

// Ciclos
import { CiclosPage } from "../features/ciclos/components/CiclosPage";

// Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
function App() {
  return (
    <Routes>

      {/* Inicio */}
      <Route index element={<RoleSelection />} />

      {/* Alumno */}
      <Route path="/alumno/login" element={<LoginAlumno />} />
      <Route path="/registro" element={<RegistroAlumno />} />

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

        {/* Ver encuesta completa */}
        <Route path="completada/:idEncuesta/:idAlumno" element={<VerEncuestaCompleta />} />
        <Route path="completadas/:id" element={<VerEncuestaCompleta />} />
      </Route>


      {/* Docente (sin login ni registro como pediste) */}
      <Route path="/docente" element={<DocenteLayout />}>

        <Route path="panel" element={<PanelDocente />} />
        <Route path="reportes" element={<ReporteDocente />} />
        <Route path="informes-pendientes" element={<InformesPendientesLista />} />
        <Route path="informes-finalizados" element={<InformesFinalizados />} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />

        <Route
          path="informes-catedra/completar/:id/:informe_catedra_id"
          element={<CompletarInformeCatedra />}
        />

        <Route
          path="informes-catedra/ver/:finalizadoId/:plantillaId"
          element={<InformeFinalizadoDetalle />}
        />

      </Route>


      {/* Departamento */}
      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route path="historicos" element={<InformeSinteticoHistoricosPage />} />
        <Route path="informes/sinteticos" element={<PanelDepartamento />} />
        <Route path="informes/carreras" element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />

        <Route path="informe-sintetico/cabecera" element={<InformeSinteticoCabeceraPage />} />
        <Route path="informe-sintetico/preguntas" element={<InformeSinteticoPreguntasPage />} />
        <Route path="informe-sintetico/guardado/:id" element={<InformeSinteticoGuardadoPage />} />
      </Route>


      {/* Secretaría */}
      <Route path="/secretaria" element={<SecretariaLayout />}>
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
        <Route path="estadisticas/:encuestaId" element={<EstadisticasEncuesta />} />
        <Route path="ciclos" element={<CiclosPage />} />

        <Route path="informes-sinteticos" element={<InformesSinteticosLista />} />
        <Route path="informes-sinteticos/:id" element={<DetalleInformeSinteticoSecretaria />} />

        <Route path="nueva-encuesta" element={<NuevaEncuesta />} />
      </Route>

    </Routes>
  );
}

export default App;
