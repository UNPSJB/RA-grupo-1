import { useParams, Link } from "react-router-dom";
import { useCicloDetalle } from "../hooks/useCicloDetalle";

export function CicloDetallePage() {
  const { id } = useParams();
  const { 
    ciclo, 
    encuestas, 
    asignadas, 
    toggleEncuesta, 
    guardar,
    loading,
    saving
  } = useCicloDetalle(id);

  if (loading) return <div>Cargando datos del ciclo...</div>;
  if (!ciclo) return <div>No se encontró el ciclo.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Administrar ciclo: {ciclo.nombre}</h2>

      <p style={{ fontSize: "14px", color: "#555" }}>
        Estado: {ciclo.activo ? "Activo" : "Inactivo"}
      </p>

      <hr />

      <h4>Encuestas disponibles</h4>

      {encuestas.length === 0 && (
        <p>No hay encuestas creadas en el sistema.</p>
      )}

      {encuestas.map(e => (
        <div 
          key={e.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px"
          }}
        >
          <input 
            type="checkbox" 
            checked={asignadas.includes(e.id)}
            onChange={() => toggleEncuesta(e.id)}
          />
          <span>{e.titulo}</span>
        </div>
      ))}

      <hr style={{ marginTop: "20px" }} />

      <button 
        onClick={guardar}
        disabled={saving}
        style={{ 
          padding: "8px 14px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      <Link 
        to="/secretaria/ciclos" 
        style={{
          marginLeft: "15px",
          textDecoration: "none",
          color: "#444"
        }}
      >
        Volver
      </Link>
    </div>
  );
}
