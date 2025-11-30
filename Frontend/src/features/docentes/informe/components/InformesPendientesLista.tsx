import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InformePendienteCabecera } from "../../services/informeService";
import axios from "axios";

export default function InformesPendientesLista() {
  const [informes, setInformes] = useState<InformePendienteCabecera[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/informe-catedra-pendiente")
      .then(res => setInformes(res.data))
      .catch(err => console.error(err));
  }, []);

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
          {informes.map((inf) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
