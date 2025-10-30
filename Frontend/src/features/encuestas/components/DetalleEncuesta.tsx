import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type EncuestaHabiitada = {
  asignatura: string;
  encuesta: string;
};

export default function EncuestaDetalle() {
  const { id } = useParams(); 
  const alumnoId = 3;

  const [, setEncuestas] = useState<EncuestaHabiitada[]>([]);
  const [seleccionada, setSeleccionada] = useState<EncuestaHabiitada | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/alumnos/${alumnoId}/encuestas_disponibles`)
      .then((res) => res.json())
      .then((data: EncuestaHabiitada[]) => {
        setEncuestas(data);
        if (id !== undefined && data[parseInt(id)] !== undefined) {
          setSeleccionada(data[parseInt(id)]);
        }
      })
      .catch((err) => {
        console.error("Hubo un problema al obtener la encuesta:", err);
        setEncuestas([]);
      });
  }, [alumnoId, id]);

  if (!seleccionada) {
    return <p>La encuesta no se encontro</p>;
  }


return (
  <div className="container py-4">
      <div className="card">
          <div className="card-header bg-primary text-white">
              <h1 className="h4 mb-0">Asignatura: {seleccionada.asignatura}</h1>
          </div>
          <div className="card-body">
              <div className="alert alert-info">
                  <strong>Encuesta: </strong>{seleccionada.encuesta}
              </div>
          </div>
      </div>
  </div>
);
}