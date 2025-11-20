import { useNavigate } from "react-router-dom";

export default function SeleccionarPregunta() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow p-4 seleccionar-tipo-pregunta-card">
        <h2 className="text-center mb-4">Seleccionar pregunta abierta o cerrada</h2>

        <div className="d-grid gap-3">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/pregunta/cerrada")}
          >
            Crear Pregunta Cerrada
          </button>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/pregunta/abierta")}
          >
            Crear Pregunta Abierta
          </button>
        </div>
      </div>
    </div>
  );
}