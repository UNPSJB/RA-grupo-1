import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetalleDocente from "./Docentes";
import type { Docente } from "../types/docenteTypes";

export default function DocentePage() {
  const { id } = useParams<{ id: string }>();
  const [docente, setDocente] = useState<Docente>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/docentes/${id}/asignaturas`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el docente");
        return res.json();
      })
      .then((data) => setDocente(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando docente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error){
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }
  return <DetalleDocente docente={docente} />;
}