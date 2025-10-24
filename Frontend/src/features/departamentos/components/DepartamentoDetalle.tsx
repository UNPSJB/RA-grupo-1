import { useEffect, useState } from "react";
import ListarCarreras from "../../carreras/components/ListarCarreras";
import type { Departamento, Carrera } from "../../types/types";

function DepartamentoDetalle() {
  const [departamento, setDepartamento] = useState<Departamento | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/departamentos/1")
      .then((res) => res.json())
      .then((data) => setDepartamento(data))
      .catch((err) => console.error("Error cargando departamento:", err));

    fetch("http://127.0.0.1:8000/carreras/departamento/1")
      .then((res) => res.json())
      .then((data) => setCarreras(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando carreras:", err))

  }, []);


  if (!departamento) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Cargando departamento..</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Departamento de {departamento.nombre}</h1>
        </div>
        <div className="card-body">
          <h2 className="h5 mb-3">Carreras:</h2>
          <ListarCarreras carreras={carreras} />
        </div>
      </div>
    </div>
  );
}

export default DepartamentoDetalle;