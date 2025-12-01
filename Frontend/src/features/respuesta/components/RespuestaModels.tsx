import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import type { Pregunta, Respuesta} from "../types";

import "./RespuestasAbiertas.css"

export function ModalRespuestasAbiertas({ListaRespuestas, pregunta, numeroPregunta, mostrar, setMostrar} : {ListaRespuestas : Respuesta[], pregunta : Pregunta, numeroPregunta: number, mostrar : boolean, setMostrar : (logico : boolean) => void}){

    return (
        <Modal size="xl" show={mostrar} onHide={() => setMostrar(false)} centered>
                <Modal.Header closeButton className=" m-3 align-items-start">
                    <Modal.Title> 
                        <div className="d-flex gap-3 ">

                            <Badge className="p-2 align-content-center">
                                {pregunta.grupo_pregunta.letra}{numeroPregunta + 1}
                            </Badge>

                            <Badge className="p-2 align-content-center">
                                Pregunta {pregunta.tipo}
                            </Badge>
                        </div>
        
                        <h4 className="mb-0 mt-3">
                            {pregunta.texto}
                        </h4>

                        <h5 className="mb-0 mt-3 fw-normal">
                            {ListaRespuestas.filter((respuesta) => respuesta.pregunta.id === pregunta.id).length} respuestas totales
                        </h5>
                    </Modal.Title>
                </Modal.Header>


                <Modal.Body className="border rounded m-3">
                    <div className="contenedor-scroll" style={{maxHeight: '400px', overflowY: 'auto',  padding: '1.25rem'}}>
                        {ListaRespuestas.filter((respuesta) => respuesta.pregunta.id === pregunta.id).map((respuesta, numero) => 
                                
                                respuesta.pregunta.id == pregunta.id &&
                                <ListGroup.Item className="mb-3 rounded p-3" style={{border: "1px solid #dee2e6", borderLeft: "5px solid #0d6efd"}}  >

                                        <Badge className="mb-2">
                                            Estudiante {numero +  1} 
                                        </Badge>

                                        <p className="mb-0 ms-2">
                                            {respuesta.texto}
                                        </p>
                                </ListGroup.Item>    

                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => setMostrar(false)} variant="primary"> Cerrar </Button>
                </Modal.Footer>
            </Modal>
    );


}