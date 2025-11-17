import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

// 🔵 SEDES HARDCODEADAS (por ahora)
const SEDES = [
  "Puerto Madryn",
  "Comodoro Rivadavia",
  "Trelew",
  "Esquel",
];

const DURACIONES = [
  { value: "ANUAL", label: "Anual" },
  { value: "PRIMER_CUATRIMESTRE", label: "1er Cuatrimestre" },
  { value: "SEGUNDO_CUATRIMESTRE", label: "2do Cuatrimestre" },
];

export default function InformeSinteticoCabeceraPage() {
  const navigate = useNavigate();

  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);

  const [selectedDepto, setSelectedDepto] = useState<number | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState<number | null>(null);
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [selectedDuracion, setSelectedDuracion] = useState<string>("");
  const [anio, setAnio] = useState("");

  // 🔹 1. Traer departamentos
  useEffect(() => {
    fetch(`${API}/departamentos/`)
      .then((res) => res.json())
      .then(setDepartamentos)
      .catch(() => alert("Error cargando departamentos"));
  }, []);

  // 🔹 2. Traer carreras cuando cambia el departamento
  useEffect(() => {
    if (!selectedDepto) return;

    fetch(`${API}/carreras/?departamento_id=${selectedDepto}`)
      .then((res) => res.json())
      .then(setCarreras)
      .catch(() => alert("Error cargando carreras"));
  }, [selectedDepto]);

  // 🔹 3. Continuar a preguntas del informe
  const handleContinuar = () => {
    if (!selectedDepto || !selectedCarrera || !selectedSede || !anio || !selectedDuracion) {
      alert("Complete todos los campos");
      return;
    }

    // Guardamos la cabecera en localStorage
    const cabecera = {
      departamento_id: selectedDepto,
      carrera_id: selectedCarrera,
      sede: selectedSede,
      anio,
      duracion: selectedDuracion,
    };

    localStorage.setItem("cabecera_informe_sintetico", JSON.stringify(cabecera));

    // Redirigir al paso 2 (preguntas)
    navigate("/departamento/informe-sintetico/preguntas");
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Informe Sintético — Cabecera</h2>
        </div>

        <div className="card-body">

          {/* Departamento */}
          <div className="mb-3">
            <label className="form-label fw-bold">Departamento</label>
            <select
              className="form-control"
              value={selectedDepto ?? ""}
              onChange={(e) => setSelectedDepto(Number(e.target.value))}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Carrera */}
          <div className="mb-3">
            <label className="form-label fw-bold">Carrera</label>
            <select
              className="form-control"
              value={selectedCarrera ?? ""}
              onChange={(e) => setSelectedCarrera(Number(e.target.value))}
              disabled={!selectedDepto}
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Año */}
          <div className="mb-3">
            <label className="form-label fw-bold">Año del Informe</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ejemplo: 2024"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            />
          </div>

          {/* Duración */}
          <div className="mb-3">
            <label className="form-label fw-bold">Duración</label>
            <select
              className="form-control"
              value={selectedDuracion}
              onChange={(e) => setSelectedDuracion(e.target.value)}
            >
              <option value="">Seleccione duración</option>
              {DURACIONES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sede */}
          <div className="mb-3">
            <label className="form-label fw-bold">Sede</label>
            <select
              className="form-control"
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
            >
              <option value="">Seleccione sede</option>
              {SEDES.map((sede) => (
                <option key={sede} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
          </div>

          {/* Botón continuar */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary" onClick={handleContinuar}>
              Continuar →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
