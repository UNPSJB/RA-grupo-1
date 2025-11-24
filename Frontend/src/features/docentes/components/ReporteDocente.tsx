import React, { useState } from "react";
import { Container, Card, Row, Col, Tab, Nav, Badge } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/ReporteDocente.css";

export const ReporteDocente = () => {
  const [activeTab, setActiveTab] = useState("A");
  const COLORS = ["#002B5C", "#B4A269", "#198754", "#6c757d", "#dc3545"];

  const categorias = [
    {
      codigo: "A",
      nombre: "Info. General",
      icon: "bi-info-circle",
      preguntas: [
        { texto: "¿Veces inscripto?", opciones: { "Una": 65, "Más de una": 35 } },
        { texto: "Asistencia Teórica", opciones: { "0-50%": 20, "> 50%": 80 } },
        { texto: "Asistencia Práctica", opciones: { "0-50%": 25, "> 50%": 75 } },
        { texto: "Conocimientos previos", opciones: { "Escasos": 30, "Suficientes": 70 } }
      ]
    },
    {
      codigo: "B",
      nombre: "Comunicación",
      icon: "bi-chat-left-text",
      preguntas: [
        { texto: "Información inicio curso", opciones: { "Sí": 85, "No": 10, "NPO": 5 } },
        { texto: "Bibliografía disponible", opciones: { "Sí": 78, "No": 12, "NPO": 10 } },
        { texto: "Buena comunicación", opciones: { "Sí": 82, "No": 8, "NPO": 10 } }
      ]
    },
    {
      codigo: "C",
      nombre: "Metodología",
      icon: "bi-gear-wide-connected",
      preguntas: [
        { texto: "Clases de apoyo", opciones: { "Sí": 75, "No": 15, "NPO": 10 } },
        { texto: "Teoría corresponde práctica", opciones: { "Sí": 80, "No": 12, "NPO": 8 } },
        { texto: "Utilidad laboratorio", opciones: { "Sí": 88, "No": 7, "NPO": 5 } }
      ]
    },
    {
      codigo: "D",
      nombre: "Evaluación",
      icon: "bi-clipboard-check",
      preguntas: [
        { texto: "Relación Teoría-Práctica", opciones: { "Sí": 79, "No": 15, "NPO": 6 } },
        { texto: "Temas evaluados vs dados", opciones: { "Sí": 72, "No": 19, "NPO": 9 } },
        { texto: "Devolución resultados", opciones: { "Sí": 69, "No": 18, "NPO": 13 } }
      ]
    },
    {
      codigo: "E",
      nombre: "Cátedra",
      icon: "bi-people-fill",
      preguntas: [
        { texto: "Respeto planificación", opciones: { "Sí": 80, "No": 10, "NPO": 10 } },
        { texto: "Puntualidad", opciones: { "Sí": 82, "No": 9, "NPO": 9 } },
        { texto: "Ejemplos prácticos", opciones: { "Sí": 76, "No": 12, "NPO": 12 } },
        { texto: "Recursos didácticos", opciones: { "Sí": 88, "No": 6, "NPO": 6 } },
        { texto: "Espacio de dudas", opciones: { "Sí": 91, "No": 4, "NPO": 5 } },
        { texto: "Claridad al explicar", opciones: { "Sí": 89, "No": 7, "NPO": 4 } }
      ]
    },
    {
      codigo: "F",
      nombre: "Institucional",
      icon: "bi-building",
      preguntas: [
        { texto: "Atención administrativa", opciones: { "Sí": 72, "No": 15, "NPO": 13 } },
        { texto: "Cordialidad", opciones: { "Sí": 81, "No": 9, "NPO": 10 } },
        { texto: "Biblioteca adecuada", opciones: { "Sí": 70, "No": 20, "NPO": 10 } },
        { texto: "Siu Guaraní útil", opciones: { "Sí": 85, "No": 5, "NPO": 10 } },
        { texto: "Aulas adecuadas", opciones: { "Sí": 68, "No": 22, "NPO": 10 } },
        { texto: "Recursos informáticos", opciones: { "Sí": 63, "No": 25, "NPO": 12 } }
      ]
    },
    {
      codigo: "G",
      nombre: "Global",
      icon: "bi-star-fill",
      preguntas: [
        { texto: "Experiencia global", opciones: { "Excelente (4)": 55, "Muy Buena (3)": 30, "Buena (2)": 10, "Mala (1)": 5 } }
      ]
    }
  ];


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p className="label mb-0 fw-bold" style={{ color: payload[0].payload.fill }}>{`${payload[0].name}`}</p>
          <p className="intro mb-0">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Container className="reporte-container animate-fade-in pb-5">
      
      {/* 2. SISTEMA DE PESTAÑAS Y GRÁFICOS */}
      <div className="details-section">
        <h4 className="section-title mb-3">Detalle por Categoría</h4>
        
        <Tab.Container id="reporte-tabs" defaultActiveKey="A" onSelect={(k) => setActiveTab(k || "A")}>
          <Card className="tabs-main-card border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 pt-3 px-3">
              <Nav variant="pills" className="custom-nav-pills gap-2 flex-nowrap overflow-auto pb-2">
                {categorias.map((cat) => (
                  <Nav.Item key={cat.codigo}>
                    <Nav.Link eventKey={cat.codigo} className="tab-link d-flex align-items-center gap-2">
                      <i className={`bi ${cat.icon}`}></i>
                      <span className="d-none d-md-inline">{cat.nombre}</span>
                      <span className="d-md-none">{cat.codigo}</span>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Header>

            <Card.Body className="bg-light-uni">
              <Tab.Content>
                {categorias.map((cat) => (
                  <Tab.Pane key={cat.codigo} eventKey={cat.codigo} className="animate-slide-up">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0 text-primary fw-bold">
                        <Badge bg="primary" className="me-2">{cat.codigo}</Badge>
                        {cat.nombre}
                      </h5>
                    </div>
                    
                    <Row className="g-4">
                      {cat.preguntas.map((p, idx) => {
                        const dataChart = Object.entries(p.opciones).map(([name, value]) => ({ name, value }));
                        
                        return (
                          <Col lg={6} key={idx}>
                            <div className="question-box bg-white p-3 rounded shadow-sm h-100 border-start-accent">
                              <p className="question-text mb-2 text-center">{p.texto}</p>
                              
                              <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                  <PieChart>
                                    <Pie
                                      data={dataChart}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                    >
                                      {dataChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend 
                                      verticalAlign="bottom" 
                                      height={36}
                                      iconType="circle"
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>

                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </div>
    </Container>
  );
};