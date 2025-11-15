import ListOpciones from "./DropDownOpciones";

interface Pregunta {
  id: number;
  oracion: string;
}

interface Opcion {
  id: number;
  contenido: string;
  pregunta_id: number;
}

interface Props {
  index: number;
  pregunta: Pregunta;
  opciones: Opcion[];
  seleccionada: number | null;
  texto: string;
  esAbierta: boolean;
  dropdownAbierto: boolean;
  onToggle: () => void;
  onSeleccionar: (opcionId: number) => void;
  onChangeTexto: (texto: string) => void;
}

export default function ItemPregunta({
  index,
  pregunta,
  opciones,
  seleccionada,
  texto,
  esAbierta,
  dropdownAbierto,
  onToggle,
  onSeleccionar,
  onChangeTexto,
}: Props) {
  const opcionSeleccionada = opciones.find((o) => o.id === seleccionada);

  return (
    <div className="col-12 mb-4">
      <div className="card">
        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <span className="text-muted me-2">{index + 1}.</span>
            <span>{pregunta.oracion}</span>
          </div>

          {esAbierta ? (
            <input
              type="text"
              className="form-control"
              placeholder="Escribi tu respuesta"
              value={texto}
              onChange={(e) => onChangeTexto(e.target.value)}
            />
          ) : (
            <ListOpciones
              opciones={opciones}
              abierta={dropdownAbierto}
              onToggle={onToggle}
              onSeleccionar={onSeleccionar}
              textoBoton={opcionSeleccionada ? opcionSeleccionada.contenido : "Seleccionar"}
              seleccionada={seleccionada}
            />
          )}
        </div>
      </div>
    </div>
  );
}