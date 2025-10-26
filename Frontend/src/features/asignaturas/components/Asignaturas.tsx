import { Asignatura } from "../types/asignaturaTypes";
import { Link } from "react-router-dom";

type Props = {
  asignaturas: Asignatura[] | undefined;
  loading?: boolean;
};

export default function ListarAsignaturas({ asignaturas, loading = false }: Props) {
  if (loading) {
    return (
      <div className="container py-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="col-12 mb-3">
            <div className="card asignatura-card">
              <div className="card-body">
                <div className="loading-skeleton" style={{ height: '24px', width: '80%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!asignaturas || asignaturas.length === 0) {
    return (
      <div className="container py-4">
        <div className="estado-vacio">
          <i className="bi bi-journal-x"></i>
          <h3 className="h5">No hay asignaturas disponibles</h3>
          <p className="text-muted">No se encontraron asignaturas habilitadas para este docente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Asignaturas Asignadas</h2>
        <span className="badge bg-primary">{asignaturas.length} asignaturas</span>
      </div>
      
      <div className="row">
        {asignaturas.map((asignatura, i) => (
          <div key={asignatura.id} className="col-12 mb-3">
            <div className="card asignatura-card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className="asignatura-number">{i + 1}</span>
                  <div>
                    <h5 className="asignatura-name mb-1">{asignatura.nombre}</h5>
                    <p className="asignatura-matricula mb-0">
                      <i className="bi bi-tag me-1"></i>
                      Código: {asignatura.matricula}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/detalleasignatura/${asignatura.id}`}
                  state={{ 
                    nombre: asignatura.nombre,
                    matricula: asignatura.matricula 
                  }}
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <i className="bi bi-eye me-2"></i>
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}