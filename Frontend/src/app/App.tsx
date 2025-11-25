import { Routes, Route } from 'react-router-dom';
import { RoleSelection } from '../features/inicio/components/RoleSelection';
import { LoginAlumno } from '../features/alumnos/components/LoginAlumno';
import { ProtectedRoute } from '../features/alumnos/components/ProtectedRoute';
import { AlumnoLayout } from '../features/alumnos/components/AlumnoLayout';
import { AsignaturasCursadas } from '../features/alumnos/components/AsignaturasCursadas';
import { AsignaturaDetalle } from '../features/alumnos/components/AsignaturaDetalle';
import { DocenteLayout } from '../features/docentes/components/DocenteLayout';
import { EncuestasIncompletas } from '../features/encuestas/components/EncuestasIncompletas';
import { EncuestasCompletas } from '../features/encuestas/components/EncuestasCompletas';
import { PanelDocente } from '../features/docentes/components/PanelDocente';
import InformeCatedraDetalle from "../features/informeCatedra/components/InformeCatedraDetalle";
import InformeFinalizadoDetalle from "../features/informeCatedra/informeCatedraTerminado/components/InformeFinalizadoDetalle";
import { MisAsignaturas } from '../features/docentes/components/MisAsignaturas';
import { DepartamentoLayout } from '../features/departamentos/components/DepartamentoLayout';
import { PanelDepartamento } from '../features/departamentos/components/PanelDepartamento'
import { GestionPreguntas } from '../features/departamentos/components/GestionPreguntas';
import { GestionEncuestas } from '../features/departamentos/components/GestionEncuestas';
import { SecretariaLayout } from '../features/secretaria/components/SecretariaLayout';
import { CrearEncuesta } from '../features/secretaria/components/CrearEncuesta';
import { PanelEncuestas } from '../features/secretaria/components/PanelEncuestas';
import { EstadisticasEncuesta } from '../features/secretaria/components/EstadisticasEncuesta';
import { CiclosPage } from "../features/ciclos/components/CiclosPage";
import { InformesFinalizados } from '../features/docentes/components/InformesFinalizados';
import DetalleEncuesta from '../features/encuestas/components/DetalleEncuesta';
import { NuevaEncuesta } from '../features/secretaria/components/NuevaEncuesta';
import CompletarEncuesta from "../features/encuestas/components/CompletarEncuesta";

//Import que agregamos
import  VerEncuestaCompleta  from '../features/encuestasCompletadas/components/VerEncuestaCompleta';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route index element={<RoleSelection />} />
      
      {/* Ruta de login de alumno (NO protegida) */}
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
        <Route path="asignaturas" element={<AsignaturasCursadas />} />
        <Route path="asignatura/:id" element={<AsignaturaDetalle />} />
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="encuestas/:encuestaId/completar" element={<CompletarEncuesta />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
        <Route path="encuesta/:id" element={<DetalleEncuesta />} />

        {/* NUEVA RUTA PARA VER RESPUESTAS SIN EDITAR */}
        <Route path="/alumno/completada/:idEncuesta/:idAlumno" element={<VerEncuestaCompleta />} />
      </Route>
      
      {/* Rutas de docente */}
      <Route path="/docente" element={<DocenteLayout />}>
        <Route index element={<PanelDocente />} /> 
        <Route path="informes-finalizados" element={<InformesFinalizados />} />
        <Route path="mis-asignaturas" element={<MisAsignaturas />} />
        <Route path="informes-catedra/completar/:finalizadoId/:plantillaId" element={<InformeCatedraDetalle />} />
        <Route path="informes-catedra/ver/:finalizadoId/:plantillaId" element={<InformeFinalizadoDetalle />} />
      </Route>


      {/* Rutas de departamento */}
      <Route path="/departamento" element={<DepartamentoLayout />}>
        <Route index element={<PanelDepartamento />} />
        <Route path="gestion-preguntas" element={<GestionPreguntas />} />
        <Route path="gestion-encuestas" element={<GestionEncuestas />} />
      </Route>

      {/* Rutas de secretaría */}
      <Route path="/secretaria" element={<SecretariaLayout />}>
        <Route path="crear-encuesta" element={<CrearEncuesta />} />
        <Route path="estadisticas/:encuestaId" element={<EstadisticasEncuesta />} />
        <Route path="panel-encuestas" element={<PanelEncuestas />} />
        <Route path="ciclos" element={<CiclosPage />} />
        <Route path="/secretaria/nueva-encuesta" element={<NuevaEncuesta />} />
      </Route>
    </Routes>
  );
}

export default App;
