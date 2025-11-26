import { useEffect, useState } from "react"
import type {TypeRespuestasFormulario } from "../types"
import { Button, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import RespuestaView from "../Respuesta/RespuestaView";

export function RespuestasFormulario({id_respuestas_formulario} :{id_respuestas_formulario : number}){

    const url_base = `http://127.0.0.1:8000/RespuestasFormulario/${id_respuestas_formulario}`

    const [respuestasFormulario, setRespuestasFormulario] = useState<TypeRespuestasFormulario>()

    let [indiceRespuestaElegida, setIndiceRespuestaElegida] = useState(0);

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())
        .then((data) => setRespuestasFormulario(data))
        .catch(error => console.log(error))
    
    }, []);

    const numeroPreguntas = respuestasFormulario?.respuestas.length? respuestasFormulario?.respuestas.length : 0;

    return(
        <>
        
        <Container className="pb-5">


            <ListGroup className="mb-4 pt-4">
                <h2> Tus respuestas </h2>
                
                <ListGroupItem>
                    <h4 className="d-flex gap-3 align-items-center"><i className="fa-solid fa-book"></i> Asignatura</h4>
                    <p className="m-0">
                        {respuestasFormulario?.asignatura.nombre}
                    </p>
                </ListGroupItem>

                <ListGroupItem>
                    <h4 className="d-flex gap-3 align-items-center"><i className="fa-regular fa-clock "></i> Completada</h4>
                    <p className="m-0">
                        {new Date(respuestasFormulario?.fecha_envio || new Date()).toLocaleDateString("es-AR", {day: "numeric", month: "long", year: "numeric"})}
                    </p>
                    
                </ListGroupItem>

            </ListGroup>
            
            <div className="mb-4">

                <h5 className="mb-3"> <i className="fa-regular fa-comment" ></i> Preguntas</h5>

                {respuestasFormulario?.respuestas.map((respuesta, indice) =>
                    <>
                        <Row className="mb-3 ms-2 me-2">
                            <Button variant="outline-dark" className="d-flex flex-wrap " onClick={() => setIndiceRespuestaElegida(indice)}> 
                                <Col xs={12} className="d-flex justify-content-between ps-3 pe-3 pt-2">
                                    <p className="text-decoration-underline">
                                        Pregunta {indice + 1}
                                        
                                    </p>
                                    <i className="fa-regular fa-circle-check"></i>
                                </Col>
                                <Col xs={12} className="d-flex ps-3 pb-2">
                                    <p>
                                        {respuesta.pregunta.texto}
                                    </p>
                                </Col>
                            </Button>
                        </Row>
                    
                    </>
                )}

            </div>

            <div className="border border-dark rounded pb-3 ms-2 me-2">
                <RespuestaView respuesta={respuestasFormulario?.respuestas? respuestasFormulario?.respuestas[indiceRespuestaElegida]  : {
                    texto: "",
                    opcion: {id: 0, texto:""},
                    pregunta: {  id: 0, texto: "", tipo: "", opciones: []}
                } } numeroPregunta={indiceRespuestaElegida + 1} cantidadPreguntas={numeroPreguntas}/>
                
                <Row className="d-flex gap-5">

                    <Col className="d-flex justify-content-center ms-5 rounded">
                        <Button onClick={() => (indiceRespuestaElegida == 0)? null : setIndiceRespuestaElegida(--indiceRespuestaElegida)} className="w-100" disabled={indiceRespuestaElegida == 0}>
                            Anterior
                        </Button>
                    </Col>

                    <Col className="d-flex justify-content-center me-5 rounded">
                        <Button onClick={() => (indiceRespuestaElegida + 1 == respuestasFormulario?.respuestas.length)? null : setIndiceRespuestaElegida(++indiceRespuestaElegida)} className="w-100" disabled={(indiceRespuestaElegida + 1 == respuestasFormulario?.respuestas.length)} > 
                            Siguiente
                        </Button>
                    </Col>
                </Row>
            </div>
        </Container>
        </>
    )
}