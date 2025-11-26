interface OpcionPorcentaje {
  opcion_id: string;
  porcentaje: number;
}

interface DatosEstadisticosPregunta {
  id_pregunta: string;
  datos: OpcionPorcentaje[];
}

interface DatosEstadisticosCategoria {
  categoria_cod: string;
  categoria_texto: string;
  promedio_categoria: OpcionPorcentaje[];
  preguntas: DatosEstadisticosPregunta[];
}

interface TablaProps {
  datos: DatosEstadisticosCategoria[];
  cant: number;
}

export default function TablaDatosEstadisticos({ datos, cant }: TablaProps) {
  if (!datos || datos.length === 0) {
    return (
      <div className="alert alert-info mt-4">
        No hay encuestas completadas
      </div>
    );
  }

  return (
    <div className="accordion accordion-flush" id="accordionDatosEstadisticos">
      {datos.map((categoria, i) => (
        <div className="accordion-item" key={categoria.categoria_cod}>
          <h2 className="accordion-header" id={`heading-cat-${i}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-cat-${i}`}
            >
              {`${categoria.categoria_cod} - ${categoria.categoria_texto} (${cant} encuestas)`}
            </button>
          </h2>
          <div
            id={`collapse-cat-${i}`}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionDatosEstadisticos"
          >
            <div className="accordion-body">
              <div className="mb-3">
                <h6 className="fw-bold">Promedio por categoría</h6>
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Opción</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoria.promedio_categoria.map((op, idx) => (
                      <tr key={idx}>
                        <td>{op.opcion_id}</td>
                        <td>{op.porcentaje.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categoria.preguntas && categoria.preguntas.length > 0 && (
                <div className="accordion accordion-flush" id={`accordion-detalle-${i}`}>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-detalle-${i}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-detalle-${i}`}
                      >
                        Ver en detalle
                      </button>
                    </h2>
                    <div
                      id={`collapse-detalle-${i}`}
                      className="accordion-collapse collapse"
                      data-bs-parent={`#accordion-detalle-${i}`}
                    >
                      <div className="accordion-body">
                        <div className="pt-2">
                          <h6 className="fw-bold">Preguntas</h6>
                          {categoria.preguntas.map((pregunta, j) => (
                            <div key={j} className="mb-3">
                              <p className="text-secondary mb-1">
                                <strong>{pregunta.id_pregunta}</strong>
                              </p>
                              <table className="table table-striped table-bordered table-sm">
                                <thead className="table-light">
                                  <tr>
                                    <th>Opción</th>
                                    <th>Porcentaje</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pregunta.datos.map((opcion, k) => (
                                    <tr key={k}>
                                      <td>{opcion.opcion_id}</td>
                                      <td>{opcion.porcentaje.toFixed(2)}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}