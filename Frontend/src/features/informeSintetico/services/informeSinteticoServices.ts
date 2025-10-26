export async function fetchInformes() {
  const res = await fetch("http://localhost:8000/informes/");
  return res.json();
}

export async function fetchInforme(id: string) {
  const res = await fetch(`http://localhost:8000/informes/${id}`);
  return res.json();
}