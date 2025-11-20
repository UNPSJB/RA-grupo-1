import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearInforme, Informe } from "../../../services/informesServices";

export const InformeForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Informe>({
    sede: "",
    ciclo_lectivo: "",
    codigo_actividad_curricular: "",
    docente_responsable: "",
    cantidad_alumnos_inscriptos: 0,
    cantidad_com_teoricas: 0,
    cantidad_com_practicas: 0,
    comision: "",
    modalidad: "",
    observaciones: "",
    estado: "abierto", // Valor por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("cantidad") ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearInforme(formData);
      alert("Informe guardado correctamente ✅");
      navigate("/docente");
    } catch (error) {
      console.error("Error al guardar informe:", error);
      alert("Error al guardar el informe ❌");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Completar Informe de Actividad Curricular</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Sede</label>
                <input
                  type="text"
                  name="sede"
                  className="form-control"
                  value={formData.sede}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Ciclo Lectivo</label>
                <input
                  type="text"
                  name="ciclo_lectivo"
                  className="form-control"
                  value={formData.ciclo_lectivo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Código de Actividad Curricular</label>
                <input
                  type="text"
                  name="codigo_actividad_curricular"
                  className="form-control"
                  value={formData.codigo_actividad_curricular}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Docente Responsable</label>
                <input
                  type="text"
                  name="docente_responsable"
                  className="form-control"
                  value={formData.docente_responsable}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad Alumnos Inscriptos</label>
                <input
                  type="number"
                  name="cantidad_alumnos_inscriptos"
                  className="form-control"
                  value={formData.cantidad_alumnos_inscriptos}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Comisiones Teóricas</label>
                <input
                  type="number"
                  name="cantidad_com_teoricas"
                  className="form-control"
                  value={formData.cantidad_com_teoricas}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Comisiones Prácticas</label>
                <input
                  type="number"
                  name="cantidad_com_practicas"
                  className="form-control"
                  value={formData.cantidad_com_practicas}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Comisión</label>
                <input
                  type="text"
                  name="comision"
                  className="form-control"
                  value={formData.comision}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Modalidad</label>
                <input
                  type="text"
                  name="modalidad"
                  className="form-control"
                  value={formData.modalidad}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Observaciones</label>
                <textarea
                  name="observaciones"
                  className="form-control"
                  rows={3}
                  value={formData.observaciones}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-select"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="abierto">Abierto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/docente")}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Informe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
