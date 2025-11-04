
import React, { useState, useEffect } from 'react';

function SeleccionarAsignatura(){
    const [asignaturas, setAsignaturas] = useState<any[]>([]);
    const [mensaje, setMensaje] = useState('');

    //materias de ejemplo
    const asignaturasEjemplo =
    [
        { id: "IF001", nombre: "Elementos de Informática" },
        { id: "MA045", nombre: "Álgebra" },
        { id: "IF002", nombre: "Expresión de Problemas y Algoritmos" },
    ];

    useEffect(() => {
        const cargarAsignaturas = async () => {
            try {//cargar desde el backend
                const response = await fetch('http://127.0.0.1:8000/asignaturas/'); 
                
                if (response.ok){
                    const data = await response.json();
                    setAsignaturas(data);
                }
                else{
                    setMensaje('Error de conexión');
                    setAsignaturas(asignaturasEjemplo);
                }
            } catch (error) {
                setMensaje('Error de conexión');
                console.error('Error de conexión', error);
                setAsignaturas(asignaturasEjemplo); //cargo ejemplos en el error
            }
        };
        cargarAsignaturas();
    }, []);

    const handleResponder = (materiaId: string, materiaNombre: string) => { 
        setMensaje(`Accediendo a encuesta`);
    };

    return (
        <div className="bg-black text-white min-vh-100 p-4" style={{ width: '100%' }}>
            <h2 className="text-center mb-4">Materias cursadas</h2>
            
            {asignaturas.map(asignatura => (
                <div key={asignatura.id} className="card bg-dark text-white mb-3 mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">{asignatura.nombre}</h5>
                        <p className="card-text">Código: {asignatura.id}</p>
                        <button 
                            className="btn"
                            style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none' }}
                            onClick={() => handleResponder(asignatura.id, asignatura.nombre)}
                        >
                            Responder encuesta
                        </button>
                    </div>
                </div>
            ))}
            
            {mensaje && <p className="text-center mt-3">{mensaje}</p>}
        </div>
    );
}

export default SeleccionarAsignatura;
