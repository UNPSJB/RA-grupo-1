import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export interface InformePendienteCabecera {
  id: number;
  asignaturaNombre: string;
  anio: number;
  duracion: number;
}

export default function InformesPendientesLista() {
  const [informes, setInformes] = useState<InformePendienteCabecera[]>([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const docenteId = Number(user?.id); // ✅ Convertir a número

  useEffect(() => {
    if (!docenteId) return;

    axios
      .get(
        `http://127.0.0.1:8000/informe-catedra-finalizado/docente/${docenteId}/pendientes`, 
        {
          params: {
            anio: 2025,     
          },
        }
      )
      .then((res) => setInformes(res.data))
      .catch((err) => {
        console.error("ERROR cargando informes:", err);
        alert("No se pudieron cargar los informes. Revisa la consola.");
      });
  }, [docenteId]);

  const abrirInforme = (informe: InformePendienteCabecera) => {
    navigate("/docente/completar-informe", { state: { ...informe } });
  };

  return (
    <div className="container py-4">
      <h3>Informes Pendientes</h3>

      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Año</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {informes.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted py-3">
                No hay informes pendientes
              </td>
            </tr>
          ) : (
            informes.map((inf) => (
              <tr key={inf.id}>
                <td>{inf.asignaturaNombre}</td>
                <td>{inf.anio}</td>
                <td>{inf.duracion}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => abrirInforme(inf)}
                  >
                    Completar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
