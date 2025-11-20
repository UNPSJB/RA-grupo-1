import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoriaManager from "../informeCatedra/ManejadorCategoria"
import OpcionesManager from "../informeCatedra/ManejadorOpciones";
import ROUTES from "../../paths";

interface CategoriaTemp { cod: string; texto: string; }
interface PreguntaTemp { enunciado: string; categoria_cod: string; tipo: 'abierta' | 'cerrada'; opcion_ids: number[]; }
interface Opcion { id: number; contenido: string; }

export default function EncuestaBaseForm() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(false);

    const [categorias, setCategorias] = useState<CategoriaTemp[]>([]);
    const [preguntas, setPreguntas] = useState<PreguntaTemp[]>([]);
    const [opcionesCatalogo, setOpcionesCatalogo] = useState<Opcion[]>([]); 

    const [nuevoEnunciado, setNuevoEnunciado] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [nuevoTipoPregunta, setNuevoTipoPregunta] = useState<'abierta' | 'cerrada'>('abierta'); 
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<number[]>([]); 
    
    useEffect(() => {
        fetch("http://localhost:8000/opciones")
            .then((res) => res.json())
            .then((data) => setOpcionesCatalogo(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error cargando opciones:", err));
    }, []);

    const agregarPregunta = () => {
        if (!nuevoEnunciado.trim() || !categoriaSeleccionada || categorias.length === 0) {
            alert("Debe ingresar enunciado y seleccionar una categoría.");
            return;
        }
        if (nuevoTipoPregunta === 'cerrada' && opcionesSeleccionadas.length === 0) {
            alert("Las preguntas cerradas deben tener al menos una opción.");
            return;
        }

        const nuevaPregunta: PreguntaTemp = {
            enunciado: nuevoEnunciado,
            categoria_cod: categoriaSeleccionada,
            tipo: nuevoTipoPregunta,
            opcion_ids: nuevoTipoPregunta === 'cerrada' ? opcionesSeleccionadas : [],
        };

        setPreguntas(prev => [...prev, nuevaPregunta]);
        setNuevoEnunciado("");
        setOpcionesSeleccionadas([]);
    };

    const eliminarPregunta = (index: number) => {
        setPreguntas(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim() || categorias.length === 0 || preguntas.length === 0) {
            alert("Complete todos los campos y agregue al menos una categoría y una pregunta.");
            return;
        }

        setCargando(true);

        try {
            const resEncuesta = await fetch("http://localhost:8000/encuestas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre }),
            });
            if (!resEncuesta.ok) { 
                const errorData = await resEncuesta.json();
                throw new Error(errorData.detail || "Error al crear encuesta."); 
            }
            const { id: encuestaId } = await resEncuesta.json();
            const categoriasCreadas = [];
            
            for (const categoriaTemp of categorias) {
                const resCat = await fetch("http://localhost:8000/categorias/paraEncuesta/", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cod: categoriaTemp.cod,
                        texto: categoriaTemp.texto || "",
                        encuesta_id: encuestaId,
                    }),
                });
                if (!resCat.ok) { 
                    const errorData = await resCat.json();
                    throw new Error(errorData.detail || `Error al crear categoría ${categoriaTemp.cod}. El código ya está en uso.`); 
                }
                const categoriaCreada = await resCat.json();
                categoriasCreadas.push(categoriaCreada);
            }

            for (const preg of preguntas) {
                const categoria = categoriasCreadas.find((c) => c.cod === preg.categoria_cod);
                if (!categoria) continue; 
                const endpoint = preg.tipo === 'cerrada' ? "http://localhost:8000/preguntas/cerrada" : "http://localhost:8000/preguntas/abierta";   
                const payload = {
                    categoria_id: categoria.id,
                    enunciado: preg.enunciado,
                    tipo: preg.tipo, 
                    ...(preg.tipo === 'cerrada' && { opcion_ids: preg.opcion_ids }), 
                };
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

            alert("Encuesta creado con éxito.");
            navigate(ROUTES.HOME);

        } catch (error) {
            console.error("Error en la cascada de creación:", error);
            const messageToShow = error instanceof Error ? error.message : "Error desconocido al procesar la solicitud.";
            alert(`Fallo en la creación del encuesta. Error: ${messageToShow}`);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="card shadow">
                <div className="card-header bg-unpsjb-header">
                    <h1 className="h4 mb-0">Nueva Encuesta Base</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>  
                        <div className="mb-4 p-3 border rounded bg-light">
                            <label className="form-label fw-bold">Nombre de la Encuesta</label>
                            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={cargando} />
                        </div>
                        <CategoriaManager
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
                                        onChange={(e) => { setNuevoTipoPregunta(e.target.value as 'abierta' | 'cerrada'); setOpcionesSeleccionadas([]); }} 
                                        disabled={cargando || categorias.length === 0} 
                                    >
                                        <option value="abierta">Abierta</option>
                                        <option value="cerrada">Cerrada</option>
                                    </select>
                                </div>
                                <div className="col-md-9">
                                    <label className="form-label fw-bold">Categoría</label>
                                    <select className="form-select" value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} disabled={cargando || categorias.length === 0} >
                                        <option value="">Seleccione categoría</option>
                                        {categorias.map((cat) => ( <option key={cat.cod} value={cat.cod}>{cat.cod} {cat.texto ? `- ${cat.texto}` : ''}</option> ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Enunciado</label>
                                <textarea className="form-control" rows={2} value={nuevoEnunciado} onChange={(e) => setNuevoEnunciado(e.target.value)} disabled={cargando || categorias.length === 0} />
                            </div>
                            {nuevoTipoPregunta === 'cerrada' && (
                                <OpcionesManager
                                    opcionesCatalogo={opcionesCatalogo}
                                    opcionesSeleccionadas={opcionesSeleccionadas}
                                    setOpcionesSeleccionadas={setOpcionesSeleccionadas}
                                    setOpcionesCatalogo={setOpcionesCatalogo}
                                    cargando={cargando}
                                />
                            )}
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className="btn btn-primary" onClick={agregarPregunta} disabled={cargando || categorias.length === 0 || !nuevoEnunciado.trim() || !categoriaSeleccionada || (nuevoTipoPregunta === 'cerrada' && opcionesSeleccionadas.length === 0)} >
                                    Agregar Pregunta a la Lista
                                </button>
                            </div>
                        </div>
                        {preguntas.length > 0 && (
                            <ul className="list-group mb-4">
                                {preguntas.map((preg, i) => (
                                    <li key={i} className={`list-group-item d-flex justify-content-between align-items-center ${preg.tipo === 'cerrada' ? 'bg-info-subtle' : ''}`}>
                                        <span>
                                            <strong className={`badge ${preg.tipo === 'cerrada' ? 'bg-primary' : 'bg-secondary'} me-2`}>{preg.tipo.toUpperCase()}</strong>
                                            <strong className="text-primary">[{preg.categoria_cod}]</strong> {preg.enunciado}
                                        </span>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarPregunta(i)} disabled={cargando}>Eliminar</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(ROUTES.HOME)} disabled={cargando}>Cancelar</button>
                            <button type="submit" className="btn btn-theme-primary" disabled={cargando}>
                                {cargando ? "Guardando en cascada..." : "Guardar Encuesta Completa"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}