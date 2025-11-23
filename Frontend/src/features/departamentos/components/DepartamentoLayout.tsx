import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar/Navbar';
import { Footer } from '../../../components/layout/Footer/Footer';
import { 
  GraduationCap, 
  ClipboardCheck, 
  Clock, 
  BarChart2, 
} from 'lucide-react';
import '../styles/DepartamentoLayout.css'; 

export const DepartamentoLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => navigate('/');
  const isDashboard = location.pathname === "/departamento";

  const departamentoNavLinks = [
    { 
      to: "/departamento", 
      label: "Panel Principal",
    },
    { 
      to: "/departamento/informes/sinteticos", 
      label: "Informes Sintéticos",
    },
    { 
      to: "/departamento/carreras", 
      label: "Carreras",
    },
    { 
      to: "/departamento/encuestas", 
      label: "Encuestas",
    },
    { 
      to: "/departamento/pendientes", 
      label: "Formularios Pendientes",
    },
    { 
      to: "/departamento/estadisticas", 
      label: "Estadísticas",
    },
    { 
      to: "/departamento/historicos", 
      label: "Históricos",
    },
    { 
      to: "#", 
      label: "Cerrar Sesión", 
      onClick: handleLogout,
    }
  ];

  const metricas = [
    { 
      titulo: 'Carreras Activas', 
      valor: 5, 
      icono: 'graduation-cap',
      type: 'primary', 
      descripcion: '2159 estudiantes totales' 
    },
    { 
      titulo: 'Informes Pendientes', 
      valor: 2, 
      icono: 'clock', 
      type: 'secondary', 
      descripcion: 'Requieren atención inmediata' 
    },
    { 
      titulo: 'En Progreso', 
      valor: 1, 
      icono: 'trending-up', 
      type: 'accent', 
      descripcion: 'Informes en desarrollo' 
    },
    { 
      titulo: 'Completados', 
      valor: 15, 
      icono: 'check-circle', 
      type: 'neutral', 
      descripcion: 'Este período académico' 
    }
  ];

  const renderIcon = (name: string) => {
    switch(name) {
      case 'graduation-cap': return <GraduationCap size={24}/>;
      case 'clock': return <Clock size={24}/>;
      case 'trending-up': return <BarChart2 size={24}/>; 
      default: return <ClipboardCheck size={24}/>;
    }
  };

  return (
    <div className="departamento-layout">
      <Navbar 
        rol="departamento_alumnos" 
        navLinks={departamentoNavLinks}
        showUserInfo={false}
      />

      {/* Header solo en /departamento */}
      {isDashboard && (
        <div className="dashboard-header">
          <div className="header-content animate-fade-in">
            <p className="header-subtitle delay-1">
              Bienvenido al sistema del Departamento de Alumnos.
            </p>
          </div>
        </div>
      )}

      <main className="main-content-area">
        <div className="content-wrapper">

          {/* Métricas solo en /departamento */}
          {isDashboard && (
            <div className="metrics-grid">
              {metricas.map((metrica, index) => (
                <div key={index} className={`metrica-card animate-slide-up delay-${index}`}>
                  <div className="card-body">
                    <div className={`icon-wrapper type-${metrica.type}`}>
                      {renderIcon(metrica.icono)}
                    </div>
                    <div className="text-wrapper">
                      <h6 className="metrica-title">
                        {metrica.titulo}
                      </h6>
                      <h3 className="metrica-value">
                        {metrica.valor}
                      </h3>
                      <small className="metrica-desc">
                        {metrica.descripcion}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aquí se renderizan las rutas hijas:
              - /departamento/informes/sinteticos → PanelDepartamento
              - /departamento/informe-sintetico/cabecera → cabecera
              - /departamento/informe-sintetico/preguntas → preguntas
          */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DepartamentoLayout;
