export async function fetchInformesCatedra() {
  const res = await fetch("http://localhost:8000/informe-catedra-finalizado/");
  return res.json();
}

export async function fetchInformeCatedra(id: string) {
  const res = await fetch(`http://localhost:8000/informe-catedra-finalizado/${id}`);
  return res.json();
}