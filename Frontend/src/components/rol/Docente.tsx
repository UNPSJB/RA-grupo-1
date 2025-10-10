//minimo asi agrego todo en app.tsx sin romper nada 
import { Outlet } from "react-router-dom";

export default function Docente() {
  return (
    <div>
      <h2>Docente</h2>
      <Outlet /> {/* Aquí se renderizan las rutas hijas */}
    </div>
  );
}
