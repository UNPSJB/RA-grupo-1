const API_URL = "http://127.0.0.1:8000";

// -----------------------------
// 🔹 Crear pregunta (cerrada o abierta)
// -----------------------------
export const crearPregunta = async (preguntaData: {
  texto: string;
  tipo: string;
  encuesta_id: number;
  categoria_id?: number | null;
}) => {
  try {
    const url =
      preguntaData.tipo === "cerrada"
        ? `${API_URL}/preguntas/cerrada`
        : `${API_URL}/preguntas/abierta`;

    // Payload simplificado - SIN opciones
    const payload = {
      texto: preguntaData.texto,
      tipo: preguntaData.tipo,
      encuesta_id: preguntaData.encuesta_id,
      categoria_id: preguntaData.categoria_id || null,
    };

    console.log('📤 POST', url, payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error creando pregunta:", errorText);
      throw new Error(`Error al crear pregunta: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Pregunta creada:', result);
    return result;
  } catch (error) {
    console.error("❌ Error creando pregunta:", error);
    throw error;
  }
};

// Resto de funciones sin cambios...
export const obtenerEncuestas = async () => {
  try {
    const response = await fetch(`${API_URL}/encuestas/`);
    if (!response.ok) {
      throw new Error(`Error al obtener encuestas: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error obteniendo encuestas:", error);
    throw error;
  }
};

export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias/`);
    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error obteniendo categorías:", error);
    throw error;
  }
};

export const eliminarPregunta = async (preguntaId: number) => {
  try {
    const response = await fetch(`${API_URL}/preguntas/${preguntaId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar pregunta: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error eliminando pregunta:", error);
    throw error;
  }
};