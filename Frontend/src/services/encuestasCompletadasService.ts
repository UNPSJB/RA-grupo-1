import api from "./api";

export const getEncuestasCompletadas = async (alumnoId: number) => {
  const { data } = await api.get(`/encuestas_completadas/${alumnoId}`);
  return data;
};
