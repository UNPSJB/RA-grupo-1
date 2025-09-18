import { Routes, Route } from 'react-router-dom'; // Quitar BrowserRouter
import Schema from './components/Schema';
import EncuestasIncompletas from './pages/EncuestasIncompletas'; // Quitar .tsx
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Schema />}>
        <Route index element={<EncuestasIncompletas />} />
        <Route path="/otra-pagina" element={<div>Otra página</div>} />
      </Route>
    </Routes>
  );
}

export default App;