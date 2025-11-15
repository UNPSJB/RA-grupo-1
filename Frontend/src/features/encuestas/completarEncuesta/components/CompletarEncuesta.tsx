import { useEffect, useState } from "react";
import ItemPregunta from "./ItemPregunta";

interface Categoria {
  id: number;
  codigo: string;
  texto: string;
}

interface Pregunta {
  id: number;
  oracion: string;
  categoria_id: number;
  encuesta_id: number;
  tipo: "cerrada" | "abierta"; 
}

interface Opcion {
  id: number;
  contenido: string;
  pregunta_id: number;
}

interface Props {
  categoria: Categoria;
  onRespuesta: (pregunta_id: number, opcion_id: number | null,texto?:string) => void;
  onTotalPreguntas?: (id: number, cantidad: number) => void; 
}

export default function PreguntasCategoria({ categoria, onRespuesta, onTotalPreguntas }: Props) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [opciones, setOpciones] = useState<Record<number, Opcion[]>>({});
  const [respuestas, setRespuestas] = useState<Record<number, { opcion_id: number | null; texto?: string }>>({});
  const [dropdownAbierto, setDropdownAbierto] = useState<number | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/categorias/${categoria.id}/preguntas`)
      .then((res) => res.json())
      .then((data: Pregunta[]) => {
        setPreguntas(data);
        const inicial: Record<number, { opcion_id: number | null; texto?: string }> = {};
        data.forEach((p) => (inicial[p.id] = { opcion_id: null, texto: "" }));
        setRespuestas(inicial);
        onTotalPreguntas?.(categoria.id, data.length);
      })
      .catch((err) =>
        console.error("Hubo un problema al obtener preguntas de la categoría:", err)
      );
  }, [categoria.id]);

const cargarOpciones = (preguntaId: number) => {
  if (opciones[preguntaId]) return;

  fetch(`http://localhost:8000/preguntas/${preguntaId}/opciones`)
    .then((res) => res.json())
    .then((data : Opcion[]) => {
      const lista = data;
      setOpciones((prev) => ({ ...prev, [preguntaId]: lista }));
    })
    .catch((err) => console.error("Hubo un problema al cargar las opciones:", err));
};

  const seleccionarOpcion = (preguntaId: number, opcionId: number) => {
    setRespuestas((prev) => {
      const nuevaRespuesta = { ...prev[preguntaId], opcion_id: opcionId };
      const updated = { ...prev, [preguntaId]: nuevaRespuesta };
      onRespuesta(preguntaId, opcionId, nuevaRespuesta.texto);
      return updated;
    });
    setDropdownAbierto(null);
  };

  const actualizarRespuestaTexto = (preguntaId: number, texto: string) => {
    setRespuestas((prev) => {
      const nuevaRespuesta = { ...prev[preguntaId], texto };
      const updated = { ...prev, [preguntaId]: nuevaRespuesta };
      onRespuesta(preguntaId, nuevaRespuesta.opcion_id, texto);
      return updated;
    });
  };

  return (
    <div>
      {preguntas.length === 0 ? (
        <div className="alert alert-warning">
          No hay preguntas disponibles para esta categoría.
        </div>
      ) : (
        preguntas.map((p, i) => (
          <ItemPregunta
            key={p.id}
            index={i}
            pregunta={p}
            opciones={opciones[p.id] || []}
            seleccionada={respuestas[p.id]?.opcion_id || null}
            texto={respuestas[p.id]?.texto || ""}
            esAbierta={p.tipo === "abierta"}
            dropdownAbierto={dropdownAbierto === p.id}
            onToggle={async () => {
              if (dropdownAbierto === p.id) setDropdownAbierto(null);
              else {
                await cargarOpciones(p.id);
                setDropdownAbierto(p.id);
              }
            }}
            onSeleccionar={(opcionId) => seleccionarOpcion(p.id, opcionId)}
            onChangeTexto={(texto) => actualizarRespuestaTexto(p.id, texto)}
          />
        ))
      )}
    </div>
  );
}