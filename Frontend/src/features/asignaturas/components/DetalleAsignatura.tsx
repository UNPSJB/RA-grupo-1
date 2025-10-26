import { useParams, useLocation } from "react-router-dom";
import { useDetalleAsignatura } from "../hooks/usedetalleAsignatura";

export default function DetalleAsignatura() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const nombreAsignatura = location.state?.nombre || "Asignatura";
  const matriculaAsignatura = location.state?.matricula || "";
  
  const { detalle, loading, error } = useDetalleAsignatura(id || "");

  if (loading) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-header detalle-header loading-skeleton" style={{ height: '80px' }}></div>
          <div className="card-body">
            <div className="loading-skeleton mb-3" style={{ height: '20px', width: '60%' }}></div>
            <div className="loading-skeleton" style={{ height: '100px', width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header detalle-header text-white">
          <div className="d-flex align-items-center">
            <span className="asignatura-id">ID: {id}</span>
            <h1 className="asignatura-title mb-0">{detalle?.nombre || nombreAsignatura}</h1>
          </div>
          {matriculaAsignatura && (
            <p className="mb-0 mt-2 opacity-75">
              <i className="bi bi-tag me-1"></i>
              Código: {detalle?.matricula || matriculaAsignatura}
            </p>
          )}
        </div>
        
        <div className="card-body">
          {detalle ? (
            <div className="row">
              {/* Información básica */}
              <div className="col-md-8">
                <div className="seccion-asignatura">
                  <h3 className="seccion-titulo">Información de la Asignatura</h3>
                  
                  {detalle.descripcion && (
                    <div className="info-card card mb-3">
                      <div className="card-header">Descripción</div>
                      <div className="card-body">
                        <p className="card-text">{detalle.descripcion}</p>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    {detalle.profesor && (
                      <div className="col-sm-6 mb-3">
                        <div className="info-card card h-100">
                          <div className="card-header">Profesor</div>
                          <div className="card-body">
                            <p className="card-text">
                              <i className="bi bi-person me-2"></i>
                              {detalle.profesor}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {detalle.horario && (
                      <div className="col-sm-6 mb-3">
                        <div className="info-card card h-100">
                          <div className="card-header">Horario</div>
                          <div className="card-body">
                            <p className="card-text">
                              <i className="bi bi-clock me-2"></i>
                              {detalle.horario}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {detalle.aula && (
                      <div className="col-sm-6 mb-3">
                        <div className="info-card card h-100">
                          <div className="card-header">Aula</div>
                          <div className="card-body">
                            <p className="card-text">
                              <i className="bi bi-building me-2"></i>
                              {detalle.aula}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {detalle.creditos && (
                      <div className="col-sm-6 mb-3">
                        <div className="info-card card h-100">
                          <div className="card-header">Créditos</div>
                          <div className="card-body">
                            <p className="card-text">
                              <i className="bi bi-award me-2"></i>
                              {detalle.creditos} créditos
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="col-md-4">
                <div className="seccion-asignatura">
                  <h3 className="seccion-titulo">Estadísticas</h3>
                  
                  <div className="info-card card mb-3">
                    <div className="card-header">Estado</div>
                    <div className="card-body">
                      <span className={`badge ${detalle.estado === 'Activa' ? 'bg-success' : 'bg-secondary'}`}>
                        {detalle.estado}
                      </span>
                    </div>
                  </div>

                  {detalle.estudiantesInscritos !== undefined && (
                    <div className="info-card card mb-3">
                      <div className="card-header">Estudiantes Inscritos</div>
                      <div className="card-body">
                        <h4 className="text-primary">{detalle.estudiantesInscritos}</h4>
                        <small className="text-muted">estudiantes</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No se encontró información detallada para esta asignatura.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}