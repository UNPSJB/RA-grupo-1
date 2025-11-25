import React, { useEffect, useState } from "react";
import { getInformesFinalizadosCabecera, InformeFinalizadoCabecera } from "../services/informeService";
import { Link } from "react-router-dom";

const DocenteId = 1;

export const InformesFinalizados: React.FC = () => {
  const [informes, setInformes] = useState<InformeFinalizadoCabecera[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInformesFinalizadosCabecera(DocenteId);
        setInformes(data);
      } catch (err) {
        console.error("Error cargando finalizados:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">

      <h4 className="mb-4 text-dark fw-bold">
        <i className="bi bi-archive-fill me-2 text-primary"></i>
        Informes Finalizados
      </h4>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">

          {informes.length > 0 ? (
            <ul className="list-group list-group-flush">
              {informes.map((inf) => (
                <li
                  key={inf.id}
                  className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center border-0"
                >
                  <div>
                    <strong>{inf.titulo}</strong>
                    <br />
                    <small className="text-muted">
                      {inf.asignaturaNombre} ({inf.asignaturaCodigo})
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-success px-3 py-2">
                      Finalizado
                    </span>
                    <Link to={`/docente/informes-catedra/ver/${inf.id}/${inf.informe_catedra_id}`} className="btn btn-primary">
                      Ver informe
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center py-4">No hay informes finalizados.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default InformesFinalizados;
