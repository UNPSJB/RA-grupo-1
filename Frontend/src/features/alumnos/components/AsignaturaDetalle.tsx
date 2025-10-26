import { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import { useParams, Navigate } from 'react-router-dom';
import '../styles/AsignaturaDetalle.css'

const GraficosTab = () => (
  <div className="tab-content">
    <div className="placeholder-graphic">
      <i className="bi bi-bar-chart display-1 text-muted"></i>
    </div>
  </div>
);

export const AsignaturaDetalle = () => {
  const { asignaturaId } = useParams<{ asignaturaId: string }>();
  const [activeTab, setActiveTab] = useState('graficos');

  // Datos de ejemplo para la api
  const asignaturaData = {
    id: parseInt(asignaturaId || '1'),
    nombre: "Algoritmica y programación 1",
    codigo: "IF01",
    carrera: "Analista Programador",
    cantidadAlumnos: 45,
    encuestasContestadas: 38,
    porcentajeCompletado: 84
  };
  
  if (!asignaturaId) {
    return <Navigate to="/alumno/asignaturas-cursadas" replace />;
  }

  const detalleNavLinks = [
    { to: "/alumno", label: "Panel Principal" },
    { to: "/alumno/asignaturas-cursadas", label: "Mis asignaturas cursadas" }
  ];
};