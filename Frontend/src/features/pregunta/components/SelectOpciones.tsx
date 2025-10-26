interface Opcion {
  id: number;
  contenido: string;
}

interface Props {
  opciones: Opcion[];
  opcionSeleccionadas: number[];
  toggleOpcion: (id: number) => void;
}

export default function OpcionesSelector({ opciones, opcionSeleccionadas, toggleOpcion }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Opciones disponibles</label>
      <div className="list-group">
        {opciones.map((opcion) => (
          <label key={opcion.id} className="list-group-item d-flex align-items-center">
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
  );
}