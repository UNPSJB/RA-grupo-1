import { useState } from 'react';
import GraficoBarrasDocente from './GraficoBarrasDocente'; 

interface OpcionPorcentaje { 
  opcion_id: string; 
  porcentaje: number; 
}

interface CategoriaEstadistica { 
  categoria_cod: string; 
  categoria_texto: string; 
  promedio_categoria: OpcionPorcentaje[]; 
  preguntas: any[]; 
}

interface EstadisticasData { 
  promedio_por_categoria: CategoriaEstadistica[]; 
  promedio_general: OpcionPorcentaje[]; 
}

interface Props {
  estadisticasBasico: EstadisticasData | null;
  estadisticasSuperior: EstadisticasData | null;
  onChangeTab?: (tab: 'basico' | 'superior') => void;
}

export default function EstadisticasTabs({
  estadisticasBasico,
  estadisticasSuperior,
  onChangeTab
}: Props) {

  const [tabActiva, setTabActiva] = useState<'basico' | 'superior'>('basico');

  const handleTabChange = (tab: 'basico' | 'superior') => {
    setTabActiva(tab);
    if (onChangeTab) onChangeTab(tab);
  };

  const datosActivos = tabActiva === 'basico' ? estadisticasBasico : estadisticasSuperior;
  const colsDashlet = tabActiva === 'basico' ? 'row-cols-md-3' : 'row-cols-md-4';

  const noDataText = tabActiva === 'basico' 
    ? 'No hay datos registrados para el Ciclo Básico en este período.' 
    : 'No hay datos registrados para el Ciclo Superior en este período.';

  const hayDatosReales = datosActivos &&
                         datosActivos.promedio_general &&
                         datosActivos.promedio_general.length > 0;

  return (
    <div className="card shadow-sm border-0 rounded-1 bg-white">
      <div className="card-header bg-white border-bottom border-light pt-3 px-3">
        <ul className="nav nav-tabs card-header-tabs">
          
          <li className="nav-item">
            <button
              className={`nav-link ${tabActiva === 'basico' ? 'active fw-bold text-dark border-bottom-0' : 'text-muted'}`}
              onClick={() => handleTabChange('basico')}
              style={{ cursor: 'pointer' }}
            >
              Ciclo Básico (1º y 2º Año)
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${tabActiva === 'superior' ? 'active fw-bold text-dark border-bottom-0' : 'text-muted'}`}
              onClick={() => handleTabChange('superior')}
              style={{ cursor: 'pointer' }}
            >
              Ciclo Superior (3º a 5º Año)
            </button>
          </li>

        </ul>
      </div>

      <div className="card-body p-4">

        {hayDatosReales ? (
          <div className="animate__animated animate__fadeIn">

            {/* --- DASHLETS --- */}
            <div className={`row ${colsDashlet} g-3 mb-4`}>
              {datosActivos!.promedio_general.map(item => (
                <div className="col" key={item.opcion_id}>
                  <div className="p-3 border rounded text-center shadow-sm">
                    <h6 className="fw-bold mb-1">{item.opcion_id}</h6>
                    <p className="mb-0 text-primary fs-5">
                      {item.porcentaje.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="text-muted opacity-25 my-4" />

            {/* --- GRÁFICO --- */}
            <div style={{ height: '500px', width: '100%' }}>
              <h6 className="fw-bold text-dark mb-3 small text-uppercase">
                Detalle por Categoría de Preguntas
              </h6>
              <GraficoBarrasDocente datosApi={datosActivos!.promedio_por_categoria} />
            </div>

          </div>
        ) : (

          /* --- SIN DATOS --- */
          <div className="text-center text-muted py-5">
            <i className="bi bi-clipboard-x fs-1 mb-3 d-block opacity-50"></i>
            <p className="mb-0 fw-bold">{noDataText}</p>
          </div>

        )}

      </div>
    </div>
  );
}
