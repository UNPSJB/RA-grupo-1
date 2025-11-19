interface Opcion {
  id: number;
  contenido: string;
  pregunta_id: number;
}

interface Props {
  opciones: Opcion[];
  abierta: boolean;
  onToggle: () => void;
  onSeleccionar: (opcionId: number) => void;
  textoBoton: string;
  seleccionada: number | null;
}

export default function ListOpciones({
  opciones,
  abierta,
  onToggle,
  onSeleccionar,
  textoBoton,
  seleccionada,
}: Props) {
  return (
    
    <div className="dropdown">
      <button
        className="btn btn-primary btn-sm dropdown-toggle"
        type="button"
        onClick={onToggle}
      >
        {textoBoton}
      </button>
      
      <ul
        className={`dropdown-menu dropdown-menu-end ${abierta ? "show" : ""}`}
        style={{ marginTop: "5px" }}
      >
        {opciones.length ? (
          opciones.map((o) => (
            <li key={o.id}>
              <button
                className={`dropdown-item ${seleccionada === o.id ? "active" : ""}`}
                onClick={() => onSeleccionar(o.id)}
              >
                {o.contenido}
               </button>
            </li>
          ))
        ) : (
          <li>
            <span className="dropdown-item text-muted">
              No existen opciones 
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}