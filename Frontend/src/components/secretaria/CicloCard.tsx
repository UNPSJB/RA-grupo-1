import { useState, ChangeEvent } from "react";
import { Card, Button, Form, Badge, Row, Col } from "react-bootstrap";
import { Ciclo } from "./CiclosPage";
interface CicloCardProps {
  ciclo: Ciclo;
  onUpdate: (id: number, formData: Partial<Ciclo>) => void;
  onDuplicate: (ciclo: Ciclo) => void;
}

const CicloCard: React.FC<CicloCardProps> = ({ ciclo, onUpdate, onDuplicate }) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    fecha_inicio: ciclo.fecha_inicio?.split("T")[0] || "",
    fecha_fin: ciclo.fecha_fin?.split("T")[0] || "",
    activo: ciclo.activo || false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{ciclo.nombre}</Card.Title>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId={`inicio-${ciclo.id}`}>
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId={`fin-${ciclo.id}`}>
              <Form.Label>Fecha de Cierre</Form.Label>
              <Form.Control
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId={`activo-${ciclo.id}`}>
          <Form.Check
            type="checkbox"
            label={formData.activo ? "Activa" : "Inactiva"}
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant={editable ? "secondary" : "primary"} onClick={() => setEditable(!editable)}>
            {editable ? "Cancelar" : "Editar"}
          </Button>
          {editable && (
            <Button variant="success" onClick={() => onUpdate(ciclo.id, formData)}>
              Actualizar
            </Button>
          )}
          <Button variant="info" onClick={() => onDuplicate(ciclo)}>
            Duplicar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CicloCard;
