import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar/Navbar';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  ClipboardCheck, 
  Clock, 
  BarChart2, 
  History, 
  LogOut 
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
      icon: <LayoutDashboard size={18} />
    },
    { 
      label: "Informes", 
      icon: <FileText size={18} />,
      isSelect: true,
      options: [ 
        { to: "/departamento/informes/sinteticos", label: "Informes Sintéticos" },
        { to: "/departamento/informes/catedra", label: "Informes de Cátedra" }
      ]
    },
    { 
      to: "/departamento/carreras", 
      label: "Carreras",
      icon: <GraduationCap size={18} />
    },
    { 
      to: "/departamento/encuestas", 
      label: "Encuestas",
      icon: <ClipboardCheck size={18} />
    },
    { 
      to: "/departamento/pendientes", 
      label: "Formularios Pendientes",
      icon: <Clock size={18} />
    },
    { 
      to: "/departamento/estadisticas", 
      label: "Estadísticas",
      icon: <BarChart2 size={18} />
    },
    { 
      to: "/departamento/historicos", 
      label: "Históricos",
      icon: <History size={18} />
    },
    { 
      to: "#", 
      label: "Cerrar Sesión", 
      onClick: handleLogout, 
      icon: <LogOut size={18} />,
      isLogout: true 
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
          
          {/* GRID DE MÉTRICAS */}
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
        </div>
      </main>
    </div>
  );
};