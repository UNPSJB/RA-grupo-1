import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

function SeccionBienvenida() {
    return (
        <div className="bienvenida-card">
            <div className="icono-bienvenida">
                <i className="bi bi-clipboard-data"></i>
            </div>
                <h1 className="titulo">
                        Bienvenido al Sistema de Encuestas de los Alumnos
                </h1>
            </div>
    );
}

export default function RoleSelection() {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'alumno',
            title: 'Alumno',
            icon: 'bi bi-mortarboard-fill',
            color: '#4285f4',
            bgColor: '#e8f0fe',
            route: '/alumno'
        },
        {
            id: 'docente',
            title: 'Docente',
            icon: 'bi bi-person-workspace',
            color: '#34a853',
            bgColor: '#e6f4ea',
            route: '/docente'
        },
        {
            id: 'departamento',
            title: 'Departamento de Alumnos',
            icon: 'bi bi-building-fill',
            color: '#9c27b0',
            bgColor: '#f3e5f5',
            route: '/departamento'
        },
        {
            id: 'secretaria',
            title: 'Secretaría Académica',
            icon: 'bi bi-shield-fill-check',
            color: '#ff6d01',
            bgColor: '#fff3e0',
            route: '/secretaria'
        }
    ];

    const handleRoleSelect = (route: string) => {
        navigate(route);
    };

    return (
        <div className="role-selection-container">
            <Container className="py-5">
                <SeccionBienvenida />
                {/* Role Cards */}
                <Row className="g-4 justify-content-center">
                    {roles.map((role) => (
                        <Col key={role.id} lg={3} md={6} sm={12}>
                            <Card 
                                className="role-card h-100"
                                style={{ 
                                    '--card-color': role.color,
                                    '--card-bg-color': role.bgColor 
                                } as React.CSSProperties}
                            >
                                <Card.Body className="d-flex flex-column text-center p-4">
                                    {/* Icon */}
                                    <div className="role-icon-container mb-3">
                                        <i 
                                            className={`${role.icon} role-icon`}
                                            style={{ color: role.color }}
                                        ></i>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        className="role-button"
                                        style={{ 
                                            backgroundColor: role.color,
                                            borderColor: role.color 
                                        }}
                                        onClick={() => handleRoleSelect(role.route)}
                                    >
                                        Acceder como {role.title}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}