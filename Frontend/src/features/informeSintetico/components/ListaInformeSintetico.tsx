import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchInformes } from "../services/informeSinteticoServices";

interface InformeSintetico {
  id: number;
  titulo: string;
  fecha: string;
}

function ListaInformeSintetico() {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);

  useEffect(() => {
    fetchInformes().then(setInformes);
  }, []);

  return (
<div className="container py-4">
  <div className="card">
    <div className="card-header bg-primary text-white">
      <h1 className="h4 mb-0">Secretaría académica</h1>
    </div>
    <div className="card-body">
      <h2 className="h5 mb-3">Informes Sintéticos</h2>
      <div className="list-group">
        {informes.map((inf, i) => (
          <div key={inf.id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted me-3">{i + 1}.</span>
                  <span className="fw-bold">
                    {inf.titulo} – {inf.fecha}
                  </span>
                </div>
                <Link
                  to={`/informes/${inf.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Ver Informe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
}

export default ListaInformeSintetico;