import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DocenteId = 1;

interface InformePendienteCabecera {
  id: number;
  asignatura_docente_id: number;
  informe_catedra_id: number;
  titulo: string;
  anio: number;
  duracion: string;
  estado: string;
  asignaturaNombre: string;
  asignaturaCodigo: string;
  asignaturaId: number;     // ← agregado
}

export default function InformesPendientesLista() {
  const navigate = useNavigate();
  const [informes, setInformes] = useState<InformePendienteCabecera[]>([]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/informe-catedra-finalizado/docente/${DocenteId}/pendientes`,
        {
          params: {
            anio: 2025,
            duracion: "anual",
          },
        }
      )
      .then((res) => {
        console.log("Pendientes recibidos del backend:", res.data); // ← log 1
        setInformes(res.data);
      })
      .catch((err) => console.error("Error cargando pendientes:", err));
  }, []);

  console.log("Informes pendientes procesados:", informes); // ← log 2

  const abrirInforme = (inf: InformePendienteCabecera) => {
    navigate(
      `/docente/informes-catedra/completar/${inf.id}/${inf.informe_catedra_id}`,
      {
        state: {
          id: inf.id,
          asignatura_docente_id: inf.asignatura_docente_id,
          asignaturaId: inf.asignaturaId, // ← ahora se pasa bien
          asignaturaNombre: inf.asignaturaNombre,
          anio: inf.anio,
          duracion: inf.duracion,
          informe_catedra_id: inf.informe_catedra_id,
        },
      }
    );
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
