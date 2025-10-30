import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useSecretaria } from "../hooks/useEncuestas";
import { Usuario } from '../types/secretariaTypes';

export const GestionUsuarios = () => {
  const { usuarios, loading, error, crearUsuario, actualizarUsuario } = useEncuestas();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'alumno' as Usuario['rol'],
    activo: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearUsuario(formData);
      setShowForm(false);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'alumno',
        activo: true
      });
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const toggleUsuarioEstado = async (usuario: Usuario) => {
    try {
      await actualizarUsuario(usuario.id, { activo: !usuario.activo });
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const getRolBadge = (rol: Usuario['rol']) => {
    const variants = {
      alumno: 'primary',
      docente: 'success',
      departamento: 'warning',
      secretaria: 'info'
    };
    return <Badge bg={variants[rol]}>{rol}</Badge>;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Gestión de Usuarios</h1>
          <p className="text-muted">Administrar usuarios del sistema</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-person-plus me-2"></i>
            Nuevo Usuario
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Nuevo Usuario</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value as Usuario['rol'] })}
                    >
                      <option value="alumno">Alumno</option>
                      <option value="docente">Docente</option>
                      <option value="departamento">Departamento</option>
                      <option value="secretaria">Secretaría</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Crear Usuario
                </Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Usuarios</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{getRolBadge(usuario.rol)}</td>
                  <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={usuario.activo ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => toggleUsuarioEstado(usuario)}
                    >
                      <i className={`bi bi-${usuario.activo ? 'x-circle' : 'check-circle'}`}></i>
                      {usuario.activo ? ' Desactivar' : ' Activar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};