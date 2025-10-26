export async function fetchInformesCatedra() {
  const res = await fetch("http://localhost:8000/informe-catedra-completado/");
  return res.json();
}

export async function fetchInformeCatedra(id: string) {
  const res = await fetch(`http://localhost:8000/informe-catedra-completado/${id}`);
  return res.json();
}