import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../features/inicio/components/Login';
import { ProtectedRoute } from '../features/alumnos/components/ProtectedRoute';

// REGISTRO GENÉRICO (NUEVO)
import Register from '../features/inicio/components/RegisterUser';

// ALUMNOS
import { PanelAlumno } from '../features/alumnos/components/PanelAlumno';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import DetalleEncuesta from '../features/encuestas/components/DetalleEncuesta';
import CompletarEncuesta from '../features/encuestas/components/CompletarEncuesta';
import VerEncuestaCompleta from '../features/encuestasCompletadas/components/VerEncuestaCompleta';

// DOCENTES
import { DocenteLayout } from '../features/docentes/components/dashboardDocente/DocenteLayout';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import { ReporteDocente } from '../features/docentes/components/ReporteDocente';
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import { InformesFinalizados } from '../features/docentes/components/InformesFinalizados';
import InformeCatedraDetalle from "../features/informeCatedra/components/InformeCatedraDetalle";
import InformeFinalizadoDetalle from "../features/informeCatedra/informeCatedraTerminado/components/InformeFinalizadoDetalle";

// DEPARTAMENTO
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento';
import InformeSinteticoCabeceraPage from '../features/departamentos/pages/InformeSinteticoCabeceraPage';
import InformeSinteticoPreguntasPage from '../features/departamentos/pages/InformeSinteticoPreguntasPage';
import InformeSinteticoGuardadoPage from '../features/departamentos/pages/InformeSinteticoGuardadoPage';
import InformeSinteticoHistoricosPage from "../features/departamentos/pages/InformeSinteticoHistoricosPage";

// SECRETARÍA
import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { GestionPreguntas } from '../features/secretaria/components/GestionPreguntas';
import { GestionEncuestas } from '../features/secretaria/components/GestionEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { CiclosPage } from "../features/ciclos/components/CiclosPage";
import { NuevaEncuesta } from '../features/secretaria/components/NuevaEncuesta';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} /> {/* NUEVO: Registro genérico único */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* RUTAS PROTEGIDAS - ALUMNO */}
      <Route
        path="/alumno"
        element={
          <ProtectedRoute allowedRoles={["alumno"]}>
            <AlumnoLayout />
          </ProtectedRoute>
        }
      >
        <Route path="panel" element={<PanelAlumno />} />
        <Route path="asignaturas" element={<AsignaturasCursadas />} />
        <Route path="asignatura/:id" element={<AsignaturaDetalle />} />
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
        <Route path="encuestas/:encuestaId/completar" element={<CompletarEncuesta />} />
        <Route path="encuesta/:id" element={<DetalleEncuesta />} />
        <Route path="completada/:idEncuesta/:idAlumno" element={<VerEncuestaCompleta />} />
      </Route>

      {/* RUTAS PROTEGIDAS - DOCENTE */}
      <Route
        path="/docente"
        element={
          <ProtectedRoute allowedRoles={["docente"]}>
            <DocenteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PanelDocente />} />
        <Route path="reportes" element={<ReporteDocente />} />
        <Route path="informes-finalizados" element={<InformesFinalizados />} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />
        <Route path="informes-catedra/completar/:finalizadoId/:plantillaId" element={<InformeCatedraDetalle />} />
        <Route path="informes-catedra/ver/:finalizadoId/:plantillaId" element={<InformeFinalizadoDetalle />} />
      </Route>

      {/* RUTAS PROTEGIDAS - DEPARTAMENTO */}
      <Route
        path="/departamento"
        element={
          <ProtectedRoute allowedRoles={["departamento"]}>
            <DepartamentoLayout />
          </ProtectedRoute>
        }
      >
        <Route path="historicos" element={<InformeSinteticoHistoricosPage />} />
        <Route path="informes/sinteticos" element={<PanelDepartamento />} />
        <Route path="informes/carreras" element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
        <Route path="informe-sintetico/cabecera" element={<InformeSinteticoCabeceraPage />} />
        <Route path="informe-sintetico/preguntas" element={<InformeSinteticoPreguntasPage />} />
        <Route path="informe-sintetico/guardado/:id" element={<InformeSinteticoGuardadoPage />} />
      </Route>

      {/* RUTAS PROTEGIDAS - SECRETARÍA ACADÉMICA */}
      <Route
        path="/secretaria"
        element={
          <ProtectedRoute allowedRoles={["secretaria_academica"]}>
            <SecretariaLayout />
          </ProtectedRoute>
        }
      >
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
        <Route path="estadisticas/:encuestaId" element={<EstadisticasEncuesta />} />
        <Route path="ciclos" element={<CiclosPage />} />
        <Route path="nueva-encuesta" element={<NuevaEncuesta />} />
      </Route>

      {/* REDIRECCIÓN POR DEFECTO */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;