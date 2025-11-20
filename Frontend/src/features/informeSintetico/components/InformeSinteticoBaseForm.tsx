import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import ROUTES from "../../paths"; 
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'; 

interface PreguntaTemp { 
    cod: string;
    enunciado: string; 
    orden: number; 
}
const reorder = (list: PreguntaTemp[], startIndex: number, endIndex: number): PreguntaTemp[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.map((item, index) => ({
        ...item,
        orden: index + 1,
    }));
};
const getListItemStyle = (isDragging: boolean, dragItemStyle: React.CSSProperties, draggableStyle: React.CSSProperties | undefined) => ({
    ...dragItemStyle,
    ...draggableStyle,
    backgroundColor: isDragging
        ? 'rgba(0, 123, 255, 0.2)' 
        : dragItemStyle.backgroundColor,
    width: isDragging ? '100%' : 'auto', 
    
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
});


export default function InformeSinteticoBaseForm() {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cargando, setCargando] = useState(false);
    const [preguntas, setPreguntas] = useState<PreguntaTemp[]>([]);
    const [nuevoTextoPregunta, setNuevoTextoPregunta] = useState("");
    const [nuevoCodPregunta, setNuevoCodPregunta] = useState("");

    const agregarPregunta = () => {
        if (!nuevoTextoPregunta.trim() || !nuevoCodPregunta.trim()) {
            alert("Debe ingresar el codigo y el texto de la pregunta.");
            return;
        }

        const nuevaPregunta: PreguntaTemp = {
            cod: nuevoCodPregunta,
            enunciado: nuevoTextoPregunta, 
            orden: preguntas.length + 1, 
        };

        setPreguntas(prev => [...prev, nuevaPregunta]);
        setNuevoTextoPregunta("");
        setNuevoCodPregunta("");
    };

    const eliminarPregunta = (index: number) => {
        setPreguntas(prev => prev
            .filter((_, i) => i !== index)
            .map((p, i) => ({ ...p, orden: i + 1 }))
        );
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            preguntas,
            result.source.index,
            result.destination.index
        );

        setPreguntas(items);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo.trim() || preguntas.length === 0) {
            alert("Complete el título y agregue al menos una pregunta.");
            return;
        }

        setCargando(true);

        try {
            const resInformeBase = await fetch("http://localhost:8000/informes_sinteticos_base/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    titulo,
                    descripcion: descripcion || null
                }),
            });

            if (!resInformeBase.ok) { 
                let errorResponseText = await resInformeBase.text();
                let errorDetail = `Error ${resInformeBase.status}: ${resInformeBase.statusText}.`;
                
                try {
                    const errorData = JSON.parse(errorResponseText);
                    errorDetail = errorData.detail || JSON.stringify(errorData); 
                } catch (e) {
                    errorDetail = errorResponseText;
                }
                
                throw new Error(`Fallo al crear Informe Base. Mensaje del servidor: ${errorDetail}`); 
            }
            
            const { id: informeBaseId } = await resInformeBase.json();

            for (const preg of preguntas) {
                const urlPregunta = `http://localhost:8000/preguntas_sintetico/${informeBaseId.toString()}`;

                const resPreg = await fetch(urlPregunta, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cod: preg.cod,
                        enunciado: preg.enunciado, 
                        orden: preg.orden, 
                        tipo_respuesta: 'texto', 
                    }),
                });

                if (!resPreg.ok) { 
                    let errorResponseText = await resPreg.text();
                    let errorDetail = `Error ${resPreg.status}: ${resPreg.statusText}.`;

                    try {
                        const errorData = JSON.parse(errorResponseText);
                        errorDetail = errorData.detail || JSON.stringify(errorData);
                    } catch (e) {
                        errorDetail = errorResponseText;
                    }

                    throw new Error(`Fallo al crear la pregunta ${preg.orden}. Mensaje del servidor: ${errorDetail}`);
                }
            }

            alert("Informe Sintético Base creado con éxito.");
            navigate(ROUTES.HOME); 

        } catch (error) {
            console.error("Error en la cascada de creación:", error);
            
            const messageToShow = error instanceof Error ? error.message : "Error desconocido y no capturado.";
            
            alert(`Fallo en la creación del informe. Error: ${messageToShow}`);
        } finally {
            setCargando(false);
        }
    };
    const cardStyle = { 
        backgroundColor: 'var(--color-component-bg)',
        border: '1px solid var(--color-unpsjb-border)', 
        color: 'var(--color-text-primary)' 
    };

    const cardHeaderStyle = {
        backgroundColor: 'var(--color-unpsjb-blue)', 
        color: 'white',
    };

    const inputAreaStyle = { 
        backgroundColor: 'var(--color-component-bg)',
        color: 'var(--color-text-primary)', 
        borderColor: 'var(--color-text-primary)'
    };
    
    const inputFieldStyle = {
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-text-primary)',
    };
    
    const dragItemStyle: React.CSSProperties = {
        cursor: 'grab', 
        backgroundColor: 'var(--color-component-bg)',
        border: '1px solid var(--color-unpsjb-border)',
        marginBottom: '5px',
        padding: '0.75rem 1.25rem',
    };

    const placeholderStyle = {
        border: '2px dashed var(--color-unpsjb-blue)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        height: '50px',
        margin: '5px 0',
        borderRadius: '5px'
    }

    return (
        <div className="container py-4">
            <div className="card shadow" style={cardStyle}>
                <div style={cardHeaderStyle} className="card-header text-white">
                    <h1 className="h4 mb-0">Nuevo Informe Sintético Base</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>  
                        <div className="mb-4 p-3 border rounded" style={inputAreaStyle}> 
                            <label className="form-label fw-bold">Título del Informe</label>
                            <input 
                                type="text" 
                                className="form-control mb-3" 
                                value={titulo} 
                                onChange={(e) => setTitulo(e.target.value)} 
                                required 
                                disabled={cargando}
                                style={inputFieldStyle}
                            />
                            <label className="form-label fw-bold">Descripción (Opcional)</label>
                            <textarea 
                                className="form-control" 
                                rows={2} 
                                value={descripcion} 
                                onChange={(e) => setDescripcion(e.target.value)} 
                                disabled={cargando}
                                style={inputFieldStyle}
                            />
                        </div>
                        <h5 className="mb-3" style={{color: 'var(--color-text-primary)'}}>Definición de Preguntas</h5>
                        <div className="card mb-4 p-3" style={inputAreaStyle}> 
                            <div className="row mb-3">
                                <div className="col-12"> 
                                    <label className="form-label fw-bold">Codigo</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={2} 
                                        value={nuevoCodPregunta} 
                                        onChange={(e) => setNuevoCodPregunta(e.target.value)} 
                                        disabled={cargando}
                                        style={inputFieldStyle}
                                    />
                                    <label className="form-label fw-bold">Enunciado</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={2} 
                                        value={nuevoTextoPregunta} 
                                        onChange={(e) => setNuevoTextoPregunta(e.target.value)} 
                                        disabled={cargando}
                                        style={inputFieldStyle}
                                    />
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-end mt-2">
                                <button 
                                    type="button" 
                                    className="btn btn-theme-primary" 
                                    onClick={agregarPregunta} 
                                    disabled={cargando || !nuevoCodPregunta.trim() || !nuevoTextoPregunta.trim()} 
                                >
                                    Agregar Pregunta a la Lista
                                </button>
                            </div>
                        </div>
                        {preguntas.length > 0 && (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="preguntas-list">
                                    {(provided, snapshot) => (
                                        <ul 
                                            className="list-group mb-4" 
                                            {...provided.droppableProps} 
                                            ref={provided.innerRef}
                                            style={{
                                                minHeight: '100px', 
                                                height: `${preguntas.length * 60}px`, 
                                                backgroundColor: snapshot.isDraggingOver ? placeholderStyle.backgroundColor : dragItemStyle.backgroundColor,
                                            }} 
                                        >
                                            {preguntas.map((preg, i) => (
                                                <Draggable key={`item-${i}`} draggableId={`item-${i}`} index={i}>
                                                    {(provided, snapshot) => (
                                                        <li 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getListItemStyle(
                                                                snapshot.isDragging, 
                                                                dragItemStyle, 
                                                                provided.draggableProps.style
                                                            )}
                                                            className={`list-group-item d-flex justify-content-between align-items-center`}
                                                        >
                                                            <span>
                                                                <strong className={`badge bg-secondary me-2`}> Orden: {preg.orden}</strong>
                                                                <strong style={{color: 'var(--color-text-primary)'}}> </strong> {preg.cod}-{preg.enunciado}
                                                            </span>
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-theme-danger btn-sm" 
                                                                onClick={() => eliminarPregunta(i)} 
                                                                disabled={cargando}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(ROUTES.HOME)} disabled={cargando}>Cancelar</button>
                            <button type="submit" className="btn btn-theme-primary" disabled={cargando}>
                                {cargando ? "Guardando en cascada..." : "Guardar Informe Completo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}