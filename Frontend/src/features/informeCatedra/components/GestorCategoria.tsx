import React, { useState } from 'react';

interface CategoriaTemp {
    codigo: string;
    texto: string;
}

interface GestorCategoriaProps {
    categorias: CategoriaTemp[];
    setCategorias: React.Dispatch<React.SetStateAction<CategoriaTemp[]>>; 
    preguntas: any[]; 
    cargando: boolean;
}

export default function GestorCategoria({
    categorias,
    setCategorias,
    preguntas,
    cargando,
}: GestorCategoriaProps) {
    const [nuevaCategoriaCodigo, setNuevaCategoriaCodigo] = useState("");
    const [nuevaCategoriaTexto, setNuevaCategoriaTexto] = useState("");

    const agregarCategoria = () => {
        const codigoNormalizado = nuevaCategoriaCodigo.trim().toUpperCase();
        if (!codigoNormalizado) {
            alert("Ingresa un código para la categoría");
            return;
        }
        if (categorias.some(c => c.codigo === codigoNormalizado)) {
            alert("Ya hay una categoría asociada a ese código en la lista");
            return;
        }

        setCategorias(prev => [...prev, { codigo: codigoNormalizado, texto: nuevaCategoriaTexto }]);
        setNuevaCategoriaCodigo("");
        setNuevaCategoriaTexto("");
    };

    const eliminarCategoria = (codigo: string) => {
        const preguntasAsociadas = preguntas.filter(p => p.categoria_codigo === codigo);
        if (preguntasAsociadas.length > 0) {
            if (!confirm(`Hay ${preguntasAsociadas.length} pregunta(s) asociada(s) a la categoría ${codigo}. ¿Desea eliminar?`)) {
                return;
            }
        }
        setCategorias(prev => prev.filter(c => c.codigo !== codigo));
    };

    return (
        <section>
            <h5 className="mb-3">1. Definición de Categorías (Bloques)</h5>
            
            <div className="card bg-light mb-4 p-3">
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            value={nuevaCategoriaCodigo}
                            onChange={(e) => setNuevaCategoriaCodigo(e.target.value)}
                            disabled={cargando}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            value={nuevaCategoriaTexto}
                            onChange={(e) => setNuevaCategoriaTexto(e.target.value)}
                            placeholder="Texto / Descripción"
                            disabled={cargando}
                        />
                    </div>
                    <div className="col-md-2 mb-2">
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={agregarCategoria}
                            disabled={cargando || !nuevaCategoriaCodigo.trim()}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>

            {categorias.length > 0 && (
                <ul className="list-group mb-4">
                    {categorias.map((cat) => (
                        <li key={cat.codigo} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>{cat.codigo}</strong>: {cat.texto}</span>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => eliminarCategoria(cat.codigo)}
                                disabled={cargando}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}