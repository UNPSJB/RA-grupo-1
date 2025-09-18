import { Form } from 'react-bootstrap';
import  {Card, Button} from 'react-bootstrap';
export default function AgregarPersona() {
  return (
    <>
    <Card>
      <Form>
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingrese el nombre" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formApellido">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" placeholder="Ingrese el apellido" />
          <Button variant="primary" type="submit" className="mt-3">
            Agregar Persona
          </Button>
        </Form.Group>
    </Form>
   </Card>  
    </>
  );
}