// App.tsx
import { Routes, Route } from 'react-router-dom';
import Alumno from './components/Alumno';
import RoleSelection from './components/RoleSelection';
import EncuestasIncompletas from './pages/EncuestasIncompletas';
import EncuestasCompletas from './pages/EncuestasCompletas'
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <Routes>
      <Route index element={<RoleSelection />} />
      
      <Route path="/alumno" element={<Alumno />}> 
        <Route path="incompletas" element={<EncuestasIncompletas />} />
        <Route path="completadas" element={<EncuestasCompletas />} />
      </Route>
      
      <Route path="/docente" element={<Alumno />}>
        <Route path="reportes" element={<div>Reportes de Docente</div>} />
      </Route>
      
      <Route path="/departamento" element={<Alumno />}>
        <Route path="gestion" element={<div>Gestión de Departamento</div>} />
      </Route>
      
      <Route path="/secretaria" element={<Alumno />}>
        <Route path="admin" element={<div>Administración</div>} />
      </Route>
    </Routes>
  );
}

export default App;