interface Opcion {
  id: number;
  contenido: string;
}

interface Props {
  opciones: Opcion[];
  opcionSeleccionadas: number[];
  toggleOpcion: (id: number) => void;
}

export default function SelectOpciones({ opciones, opcionSeleccionadas, toggleOpcion }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Opciones disponibles</label>

      <div className="card shadow-sm">
        <div className="card-body p-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
          
          {opciones.length === 0 && (
            <p className="text-muted text-center">No hay opciones aún. Agrega una nueva 👇</p>
          )}

          <div className="list-group list-group-flush">
            {opciones.map((opcion) => (
              <label
                key={opcion.id}
                className="list-group-item d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={opcionSeleccionadas.includes(opcion.id)}
                  onChange={() => toggleOpcion(opcion.id)}
                />
                {opcion.contenido}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
