import React, { useState } from "react";

interface ColumnaTabla {
  id: string;
  label: string;
}

interface EstructuraTabla {
  tipo: "tabla";
  columnas: ColumnaTabla[];
}

interface TablaDinamicaProps {
  estructura: EstructuraTabla;
  value: string | undefined;
  onChange: (val: string) => void;
}

const TablaDinamica: React.FC<TablaDinamicaProps> = ({
  estructura,
  value,
  onChange,
}) => {
  const cols = estructura.columnas;

  // ⚠ GENERAR SIEMPRE UN OBJETO NUEVO
  const crearFilaVacia = () =>
    Object.fromEntries(cols.map((c) => [c.id, ""]));

  const [filas, setFilas] = useState<any[]>(() => {
    if (!value) return [crearFilaVacia()];
    try {
      const parsed = JSON.parse(value);
      return parsed.length ? parsed : [crearFilaVacia()];
    } catch {
      return [crearFilaVacia()];
    }
  });

  const actualizar = (nuevas: any[]) => {
    setFilas(nuevas);
    onChange(JSON.stringify(nuevas));
  };

  const cambiar = (i: number, campo: string, val: string) => {
    const nuevas = filas.map((f, idx) =>
      idx === i ? { ...f, [campo]: val } : f
    );
    actualizar(nuevas);
  };

  const agregar = () => actualizar([...filas, crearFilaVacia()]);

  const borrar = (i: number) => {
    const restantes = filas.filter((_, idx) => idx !== i);
    actualizar(restantes.length ? restantes : [crearFilaVacia()]);
  };

  return (
    <>
      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            {cols.map((col) => (
              <th key={col.id}>{col.label}</th>
            ))}
            <th style={{ width: "50px" }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filas.map((fila, idx) => (
            <tr key={idx}>
              {cols.map((col) => (
                <td key={col.id}>
                  <input
                    className="form-control form-control-sm"
                    value={fila[col.id] ?? ""}
                    onChange={(e) => cambiar(idx, col.id, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => borrar(idx)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-outline-primary btn-sm" onClick={agregar}>
        + Agregar fila
      </button>
    </>
  );
};

export default TablaDinamica;
