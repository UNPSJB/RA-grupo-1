import PreguntaFormulario from "../components/PreguntaFormulario";

export default function CrearPreguntaCerrada() {
  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Crear Pregunta Cerrada</h1>
        </div>
        <div className="card-body">
          <PreguntaFormulario />
        </div>
      </div>
    </div>
  );
}