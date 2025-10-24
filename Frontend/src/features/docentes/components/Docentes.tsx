import type { Docente } from "../../types/types";
import ListaMaterias from "../materia/materias";

type Props = {
  docente: Docente | undefined;
};


export default function DetalleDocente ({ docente }: Props){
  if (!docente) {
    return (
      <div className="container -py-4">
        <div className="alert alert-warning text-center">Docente no existe</div>
      </div>
    );
  }

 return(
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">{docente.nombre} {docente.apellido}</h1>
        </div>
        <div className="card-body">
          <ListaMaterias materias={docente.materias} />
        </div>
      </div>
    </div>
  );
}