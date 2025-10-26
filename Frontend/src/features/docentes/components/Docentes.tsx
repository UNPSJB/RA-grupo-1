import type { Docente } from "../types/docenteTypes";
import ListarAsignaturas from "../../asignaturas/components/Asignaturas";

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
          <ListarAsignaturas asignaturas={docente.asignaturas} />
        </div>
      </div>
    </div>
  );
}