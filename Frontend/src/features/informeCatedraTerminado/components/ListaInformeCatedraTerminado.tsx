import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { verPeriodo } from "./DetalleInformeCatedraTerminado";
import type { Departamento } from "../../departamentos/types/departamentoTypes";

interface InformeCatedraTerminado {
  id: number;
  titulo: string;
  anio: number;
  periodo: string;
}

export default function InformeCatedraList() {
  const [informes, setInformes] = useState<InformeCatedraTerminado[]>([]);
  const [departamento, setDepartamento] = useState<Departamento | null>(null);
  const departamentoId = 1; 

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/departamentos/${departamentoId}`)
      .then(res => res.json())
      .then(setDepartamento)
      .catch(console.error);
    fetch(`http://127.0.0.1:8000/informe-catedra-finalizado/departamento/${departamentoId}`)
      .then(res => res.json())
      .then(setInformes)
      .catch(console.error);
  }, [departamentoId]);

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">
            <strong>Departamento de</strong> {departamento?.nombre}
          </h1>
        </div>
        <div className="card-body">
          <h2 className="h5 mb-3">Informes de Cátedra</h2>
          {informes.length === 0 ? (
            <p className="text-muted">No hay informes disponibles.</p>
          ) : (
            <div className="list-group">
              {informes.map((inf, i) => (
                <div key={inf.id} className="col-12 mb-3">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted me-3">{i + 1}.</span>
                        <span className="fw-bold">
                          {inf.titulo} – {inf.anio} ({verPeriodo(inf.periodo)})
                        </span>
                      </div>
                      <Link
                        to={`/informes-catedra/${inf.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}