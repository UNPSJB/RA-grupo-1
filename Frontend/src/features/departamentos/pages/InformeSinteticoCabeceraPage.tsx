import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

const DURACIONES = [
  { value: "ANUAL", label: "Anual" },
  { value: "PRIMER CUATRIMESTRE", label: "1er Cuatrimestre" },
  { value: "SEGUNDO CUATRIMESTRE", label: "2do Cuatrimestre" },
];

export default function InformeSinteticoCabeceraPage() {
  const navigate = useNavigate();

  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]); // sedes desde el backend

  const [selectedDepto, setSelectedDepto] = useState<number | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState<number | null>(null);
  const [selectedSede, setSelectedSede] = useState<string>(""); // guardamos el nombre
  const [selectedDuracion, setSelectedDuracion] = useState<string>("");
  const [anio, setAnio] = useState("");
  const [anioError, setAnioError] = useState(""); // 👈 error de año
  const [integrantes, setIntegrantes] = useState("");

  // 1) Traer departamentos
  useEffect(() => {
    fetch(`${API}/departamentos/`)
      .then((res) => res.json())
      .then(setDepartamentos)
      .catch(() => alert("Error cargando departamentos"));
  }, []);

  // 2) Traer sedes
  useEffect(() => {
    fetch(`${API}/sedes/`)
      .then((res) => res.json())
      .then(setSedes)
      .catch(() => alert("Error cargando sedes"));
  }, []);

  // 3) Traer carreras cuando cambia el departamento
  useEffect(() => {
    if (!selectedDepto) return;

    fetch(`${API}/carreras/?departamento_id=${selectedDepto}`)
      .then((res) => res.json())
      .then(setCarreras)
      .catch(() => alert("Error cargando carreras"));
  }, [selectedDepto]);

  // 4) Cargar carrera/depto desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("carreraSeleccionada");
    if (stored) {
      const carrera = JSON.parse(stored);
      setSelectedCarrera(carrera.id);

      if (carrera.departamento_id) {
        setSelectedDepto(carrera.departamento_id);
      }
    }
  }, []);

  // 5) Preseleccionar sede real de ese depto
  useEffect(() => {
    if (!selectedDepto || departamentos.length === 0) return;

    const depto = departamentos.find((d) => d.id === selectedDepto);
    if (depto && depto.sede) {
      setSelectedSede(depto.sede.nombre); // Ej: "Trelew"
    }
  }, [selectedDepto, departamentos]);

  // 6) Continuar a preguntas (con validación de año)
  const handleContinuar = () => {
    const numAnio = Number(anio);

    if (
      !selectedDepto ||
      !selectedCarrera ||
      !selectedSede ||
      !selectedDuracion ||
      !integrantes.trim() ||
      !anio ||
      Number.isNaN(numAnio) ||
      numAnio <= 0
    ) {
      alert("Complete todos los campos y ponga un año válido");
      return;
    }

    const cabecera = {
      departamento_id: selectedDepto,
      carrera_id: selectedCarrera,
      sede: selectedSede,
      anio: numAnio,
      duracion: selectedDuracion,
      integrantes,
    };

    localStorage.setItem(
      "cabecera_informe_sintetico",
      JSON.stringify(cabecera)
    );
    navigate("/departamento/informe-sintetico/preguntas");
  };

  return (
    <div className="container py-4 mt-5">
      <div className="card shadow" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header bg-primary text-white text-center">
          <h2 className="h4 mb-0">Informe Sintético</h2>
        </div>

        <div
          className="card-body"
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div
            style={{
              border: "1px solid black",
              padding: "20px",
              width: "100%",
              maxWidth: "750px",
            }}
          >
            {/* Ciclo */}
            <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
              Ciclo Lectivo y/o cuatrimestre evaluado:
            </p>
            <input
              type="number"
              className="form-control mb-1"
              placeholder="Año (ej: 2024)"
              value={anio}
              onChange={(e) => {
                const value = e.target.value;

                // si está vacío, dejamos vacío y limpiamos error
                if (value === "") {
                  setAnio("");
                  setAnioError("");
                  return;
                }

                const num = Number(value);

                // si es negativo, mostramos mensaje y NO actualizamos el año
                if (num < 0) {
                  setAnioError("Porfavor ingresar un año valido");
                  return;
                }

                // si es válido, limpiamos error y actualizamos
                setAnioError("");
                setAnio(value);
              }}
            />
            {anioError && (
              <span
                style={{
                  color: "red",
                  fontSize: "0.85rem",
                }}
              >
                *{anioError}*
              </span>
            )}

            <select
              className="form-control mb-3 mt-2"
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

            {/* Comisión / Departamento */}
            <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
              Comisión Asesora de Carrera o Departamental correspondiente a:
            </p>
            <select
              className="form-control mb-3"
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

            {/* Carrera */}
            <p style={{ textDecoration: "underline", fontWeight: "bold" }}>Carrera:</p>
            <select
              className="form-control mb-3"
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

            {/* Sede */}
            <p style={{ textDecoration: "underline", fontWeight: "bold" }}>Sede:</p>
            <select
              className="form-control mb-3"
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              disabled={!selectedDepto}
            >
              <option value="">Seleccione sede</option>
              {sedes.map((s: any) => (
                <option key={s.id} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>

            {/* Integrantes */}
            <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
              Integrantes:
            </p>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Integrantes..."
              value={integrantes}
              onChange={(e) => setIntegrantes(e.target.value)}
            />
          </div>

          {/* Leyenda */}
          <p
            className="text-muted mt-4"
            style={{
              maxWidth: "750px",
              textAlign: "justify",
              fontSize: "0.9rem",
            }}
          >
            El Informe anual Sintético muestra en forma resumida el detalle de las actividades curriculares.
            Tiene como propósito el ofrecer información de las actividades curriculares dependientes de
            cada departamento, Delegación de Facultad o Secretaría Académica, que permita analizar la
            evolución de cada espacio curricular dentro de cada dependencia y por Sede de Facultad con el
            fin de realizar un seguimiento y acompañamiento de las propuestas de mejora realizadas por
            cada equipo docente.
          </p>

          {/* Botón */}
          <button className="btn btn-primary mt-3" onClick={handleContinuar}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
