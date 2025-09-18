import { Routes, Route } from 'react-router-dom';   
import Schema from './components/Schema';
import Main from './pages/main'
import EncuestasIncompletas from './pages/EncuestasIncompletas'; 
import EncuestasCompletas from './pages/EncuestasCompletas'
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Schema />}>
        <Route index element={<Main />} />
        <Route path="encuestas-completas" element={<EncuestasCompletas />} />
        <Route path="/encuestas-incompletas" element={<EncuestasIncompletas/>}/>
      </Route>
    </Routes>
  );
}

export default App;