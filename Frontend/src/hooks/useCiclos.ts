import { useState, useEffect } from "react";
import { Ciclo } from "../components/secretaria/CiclosPage";

export function useCiclos() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCiclos();
  }, []);

  async function fetchCiclos() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://127.0.0.1:8000/ciclos"); 
      if (!res.ok) throw new Error("error al cargar los ciclos");
      const data: Ciclo[] = await res.json();
      setCiclos(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateCicloHook(id: number, formData: Partial<Ciclo>) {
    await fetch(`http://127.0.0.1:8000/ciclos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    fetchCiclos();
  }

  async function createCicloHook(data: Ciclo) {
    await fetch("http://127.0.0.1:8000/ciclos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchCiclos();
  }

  return { ciclos, loading, error, updateCicloHook, createCicloHook, fetchCiclos };
}
