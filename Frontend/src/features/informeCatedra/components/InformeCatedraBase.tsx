import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GestorCategoria from "../components/GestorCategoria";
import GestorOpciones from "../components/GestorOpciones";
import { CategoriaTemp, PreguntaTemp } from '../types/informeCatedraTypes';

interface Opcion { id: number; contenido: string; }

export default function InformeCatedraBaseForm() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [cargando, setCargando] = useState(false);

  const [categorias, setCategorias] = useState<CategoriaTemp[]>([]);
  const [preguntas, setPreguntas] = useState<PreguntaTemp[]>([]);
  const [opcionesCatalogo, setOpcionesCatalogo] = useState<Opcion[]>([]);

  const [nuevoEnunciado, setNuevoEnunciado] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [nuevoTipoPregunta, setNuevoTipoPregunta] =
    useState<'abierta' | 'cerrada'>('abierta');
  const [nuevoNroPregunta, setNuevoNroPregunta] = useState<number>(0);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/opciones")
      .then((res) => res.json())
      .then((data) => setOpcionesCatalogo(Array.isArray(data) ? data : []));
  }, []);

  const agregarPregunta = () => {
    if (!nuevoEnunciado.trim() || !categoriaSeleccionada || categorias.length === 0) {
      alert("Ingresa una pregunta y selecciona una categoría.");
      return;
    }
    if (nuevoTipoPregunta === 'cerrada' && opcionesSeleccionadas.length === 0) {
      alert("Las preguntas cerradas tienen que tener al menos una opción.");
      return;
    }

    const nuevaPregunta: PreguntaTemp = {
      enunciado: nuevoEnunciado,
      categoria_codigo: categoriaSeleccionada,                  // ← unificado
      tipo: nuevoTipoPregunta,
      nro_pregunta: nuevoNroPregunta,
      opcion_ids: nuevoTipoPregunta === 'cerrada' ? opcionesSeleccionadas : [],
    };

    setPreguntas((prev) => [...prev, nuevaPregunta]);
    setNuevoEnunciado("");
    setOpcionesSeleccionadas([]);
  };

  const eliminarPregunta = (index: number) => {
    setPreguntas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || categorias.length === 0 || preguntas.length === 0) {
      alert("Completa todos los campos, agrega una categoría y una pregunta.");
      return;
    }

    setCargando(true);

    try {
      const resInforme = await fetch("http://localhost:8000/informes_catedra/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      if (!resInforme.ok) {
        const errorData = await resInforme.json();
        throw new Error(errorData.detail || "Error al crear el informe base.");
      }
      const { id: informeId } = await resInforme.json();

      const categoriasCreadas: any[] = [];
      for (const categoriaTemp of categorias) {
        const resCat = await fetch("http://localhost:8000/categorias/paraInforme/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cod: categoriaTemp.codigo,           // si tu backend espera 'cod'
            texto: categoriaTemp.texto || "",
            informe_base_id: informeId,
          }),
        });
        if (!resCat.ok) {
          const errorData = await resCat.json();
          throw new Error(
            errorData.detail || `Error al crear la categoría ${categoriaTemp.codigo}.`
          );
        }
        const categoriaCreada = await resCat.json();
        categoriasCreadas.push(categoriaCreada);
      }

      for (const preg of preguntas) {
        const categoria = categoriasCreadas.find(
          (c) => c.cod === preg.categoria_codigo || c.codigo === preg.categoria_codigo
        );
        if (!categoria) continue;

        const endpoint =
          preg.tipo === 'cerrada'
            ? "http://localhost:8000/preguntas/cerrada"
            : "http://localhost:8000/preguntas/abierta";

        const payload: any = {
          categoria_id: categoria.id,
          enunciado: preg.enunciado,
          tipo: preg.tipo,
        };
        if (preg.tipo === 'cerrada') payload.opcion_ids = preg.opcion_ids;

        const resPreg = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resPreg.ok) {
          const errorData = await resPreg.json();
          throw new Error(errorData.detail || `Error al crear la pregunta: ${preg.enunciado}`);
        }
      }

      alert("Informe de cátedra creado.");
      navigate("/");
    } catch (error) {
      const messageToShow =
        error instanceof Error ? error.message : "Error al procesar la solicitud.";
      alert(`Hubo un problema al crear el informe. Error: ${messageToShow}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Crear Nuevo Informe de Cátedra</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 p-3 border rounded bg-light">
              <label className="form-label fw-bold">Título del Informe</label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                disabled={cargando}
              />
            </div>

            <GestorCategoria
              categorias={categorias}
              setCategorias={setCategorias}
              preguntas={preguntas}
              cargando={cargando}
            />

            <h5 className="mb-3">2. Definición de Preguntas</h5>
            <div className="card bg-light mb-4 p-3">
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-bold">Tipo</label>
                  <select
                    className="form-select"
                    value={nuevoTipoPregunta}
                    onChange={(e) => {
                      setNuevoTipoPregunta(e.target.value as 'abierta' | 'cerrada');
                      setOpcionesSeleccionadas([]);
                    }}
                    disabled={cargando || categorias.length === 0}
                  >
                    <option value="abierta">Abierta</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>
                <div className="col-md-9">
                  <label className="form-label fw-bold">Categoría</label>
                  <select
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    disabled={cargando || categorias.length === 0}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.codigo} value={cat.codigo}>
                        {cat.codigo}{cat.texto ? ` - ${cat.texto}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Enunciado</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={nuevoEnunciado}
                  onChange={(e) => setNuevoEnunciado(e.target.value)}
                  disabled={cargando || categorias.length === 0}
                />
              </div>

              {nuevoTipoPregunta === 'cerrada' && (
                <GestorOpciones
                  opcionesCatalogo={opcionesCatalogo}
                  opcionesSeleccionadas={opcionesSeleccionadas}
                  setOpcionesSeleccionadas={setOpcionesSeleccionadas}
                  setOpcionesCatalogo={setOpcionesCatalogo}
                  cargando={cargando}
                />
              )}

              <div className="d-flex justify-content-end mt-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={agregarPregunta}
                  disabled={
                    cargando ||
                    categorias.length === 0 ||
                    !nuevoEnunciado.trim() ||
                    !categoriaSeleccionada ||
                    (nuevoTipoPregunta === 'cerrada' && opcionesSeleccionadas.length === 0)
                  }
                >
                  Agregar una Pregunta a la Lista
                </button>
              </div>
            </div>

            {preguntas.length > 0 && (
              <ul className="list-group mb-4">
                {preguntas.map((preg, i) => (
                  <li
                    key={i}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      preg.tipo === 'cerrada' ? 'bg-info-subtle' : ''
                    }`}
                  >
                    <span>
                      <strong className={`badge ${preg.tipo === 'cerrada' ? 'bg-primary' : 'bg-secondary'} me-2`}>
                        {preg.tipo.toUpperCase()}
                      </strong>
                      <strong className="text-primary">[{preg.categoria_codigo}]</strong> {/* ← unificado */}
                      {' '}{preg.enunciado}
                    </span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarPregunta(i)}
                      disabled={cargando}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
                disabled={cargando}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={cargando}>
                {cargando ? "Guardando..." : "Guardar Informe Completo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
