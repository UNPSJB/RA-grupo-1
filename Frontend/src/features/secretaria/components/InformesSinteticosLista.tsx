// Frontend/secretaria/components/InformesSinteticosLista.tsx
import { useNavigate } from "react-router-dom";
import { useInformesSinteticos } from "../hooks/useInformesSinteticos";

function formatearDuracion(duracion: string) {
  const d = duracion.toLowerCase();
  if (d === "primer_cuatrimestre") return "1er Cuatrimestre";
  if (d === "segundo_cuatrimestre") return "2do Cuatrimestre";
  if (d === "anual") return "Anual";
  return duracion;
}

export default function InformesSinteticosLista() {
  const navigate = useNavigate();
  const { informes, cargando, error } = useInformesSinteticos();

  if (cargando) {
    return <p className="text-center mt-4">Cargando informes sintéticos...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-4">{error}</p>;
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-3">Históricos — Informes Sintéticos</h2>
      <p className="text-muted">
        Listado de todos los informes sintéticos finalizados (Secretaría).
      </p>

      <div className="d-flex flex-column gap-3 mt-4">
        {informes.map((inf) => (
          <div key={inf.id} className="card shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-2">{inf.titulo}</h5>

                <p className="mb-1">
                  <strong>Año:</strong> {inf.anio} —{" "}
                  <strong>Ciclo:</strong> {formatearDuracion(inf.duracion)}
                </p>

                <p className="mb-1">
                  <strong>Departamento:</strong>{" "}
                  {inf.departamento_nombre || `ID ${inf.departamento_id}`}
                </p>

                <p className="mb-1">
                  <strong>Carrera:</strong>{" "}
                  {inf.carrera_nombre || `ID ${inf.carrera_id}`}
                </p>

                <p className="mb-0">
                  <strong>Informe N.º:</strong> {inf.id}
                </p>
              </div>

              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  navigate(`/secretaria/informes-sinteticos/${inf.id}`)
                }
              >
                Ver informe
              </button>
            </div>
          </div>
        ))}

        {informes.length === 0 && (
          <p className="text-muted">
            No hay informes sintéticos finalizados para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}
