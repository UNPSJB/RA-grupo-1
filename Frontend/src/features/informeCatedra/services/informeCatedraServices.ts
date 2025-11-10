const BASE = "http://localhost:8000/informes_catedra";

export async function fetchInformesCatedra() {
  const res = await fetch(`${BASE}/`);
  if (!res.ok) throw new Error("Error listando informes de cátedra");
  return res.json();
}

export async function fetchInformeCatedraConPreguntas(id: string | number) {
  const res = await fetch(`${BASE}/${id}/categorias_con_preguntas`);
  if (!res.ok) throw new Error("Informe de cátedra no encontrado");
  return res.json();
}

export async function fetchInformeCatedra(id: string | number) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Informe de cátedra no encontrado");
  return res.json();
}
