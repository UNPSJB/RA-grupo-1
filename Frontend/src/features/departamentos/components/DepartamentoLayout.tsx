import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar/Navbar';
import { Footer } from '../../../components/layout/Footer/Footer';
import { useMetricasDepartamento } from '../hooks/useMetricasDepartamento'; 

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

  const handleLogout = () => navigate("/");
  const isDashboard = location.pathname === "/departamento";

  const rawDepto = localStorage.getItem("departamentoSeleccionado");
  const departamento = rawDepto ? JSON.parse(rawDepto) : null;

  const metricasDepto = useMetricasDepartamento(departamento?.id ?? 1);

  const departamentoNavLinks = [
    { 
      to: "/departamento", 
      label: "Panel Principal",
      icon: <LayoutDashboard size={18} />
    },
    { 
      label: "Completar Informe Sintético", 
      icon: <FileText size={18} />,
      to:"/departamento/informes/sinteticos",
      isSelect: false,
      /* options: [ 
        { to: "/departamento/informes/sinteticos", label: "Informe Sintético" },
        { to: "/departamento/informes/catedra", label: "Informe de Cátedra" }
      ]*/
    },
    { 
      to: "/departamento/carreras", 
      label: "Ver Carreras",
      icon: <GraduationCap size={18} />
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
  ] as any;

  // 📌 Métricas reales
  const metricas = [
    { 
      titulo: "Carreras Activas", 
      valor: metricasDepto.carrerasActivas,
      icono: "graduation-cap",
      type: "primary", 
      //descripcion: `${metricasDepto.carrerasActivas} carreras cargadas`
    },
    { 
      titulo: "Informes Pendientes", 
      valor: metricasDepto.informesPendientes,
      icono: "clock", 
      type: "secondary", 
      //descripcion: "Requieren atención inmediata"
    },
    /*{ 
      titulo: "En Progreso", 
      valor: 1, 
      icono: "trending-up",
      type: "accent", 
      descripcion: "En desarrollo"
    }*/,
    { 
      titulo: "Informes Sintenticos Completados", 
      valor: metricasDepto.informesCompletados,
      icono: "check-circle",
      type: "neutral", 
      //descripcion: "Este período académico"
    }
  ];

  // 📌 Render de iconos según el nombre
  const renderIcon = (name: string) => {
    switch(name) {
      case "graduation-cap": return <GraduationCap size={24} />;
      case "clock": return <Clock size={24} />;
      case "trending-up": return <BarChart2 size={24} />;
      default: return <ClipboardCheck size={24} />;
    }
  };

  return (
    <div className="departamento-layout">
      <Navbar 
        rol="departamento_alumnos" 
        navLinks={departamentoNavLinks}
        showUserInfo={false}
      />

      {/* HEADER SOLO EN /departamento */}
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

          {/* GRID DE MÉTRICAS SOLO EN /departamento */}
          {isDashboard && (
            <div className="metrics-grid">
              {metricas.map((metrica, index) => (
                <div key={index} className={`metrica-card animate-slide-up delay-${index}`}>
                  <div className="card-body">
                    <div className={`icon-wrapper type-${metrica.type}`}>
                      {renderIcon(metrica.icono)}
                    </div>
                    <div className="text-wrapper">
                      <h6 className="metrica-title">{metrica.titulo}</h6>
                      <h3 className="metrica-value">{metrica.valor}</h3>
                      <small className="metrica-desc">{metrica.descripcion}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render de las páginas hijas */}
          <Outlet />

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DepartamentoLayout;
