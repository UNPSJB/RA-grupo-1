import type { Respuesta } from "../types";
import { Badge, Col, Row } from "react-bootstrap";
import { EnumTipoPregunta } from "../types";
import type { Opcion } from "../types";

type RespuestaViewProps = {
    respuesta: Respuesta,
    numeroPregunta: number,
    cantidadPreguntas: number,
}

type mostrarOpcionesProp = {
    opciones: Opcion[]
}

function MostrarOpciones({opciones} : mostrarOpcionesProp){
    
    let filas = []

    for(let i = 0; i < opciones.length; i += 2){

        const primerElemento = opciones[i];
        const segundoElemento = i + 1 < opciones.length? opciones[i + 1] : null
        
        filas.push(
            <>
                <Row className="g-3 mb-3">                 
                    <Col md={6} >
                        <div className="border border-dark rounded p-2">
                            <p className="mb-0 ms-2">
                                {primerElemento.texto}
                            </p>
                        </div>
                    </Col>
                    {segundoElemento &&
                        <Col md={6} >
                            <div className="border border-dark rounded p-2">
                                <p className="mb-0 ms-2">
                                    {segundoElemento.texto}
                                </p>
                            </div>
                        </Col>
                    }
                </Row>
            </>
        )
    }
    return filas
}



function RespuestaView({respuesta, numeroPregunta, cantidadPreguntas} : RespuestaViewProps){

    return(
        <>            
            <div className="d-flex gap-3 align-items-center justify-content-between pt-3 ps-3 pe-4">
                <h4>{respuesta.pregunta.texto}</h4>
                <Badge bg="secondary" className="p-2 ">
                    <p className="m-0">{numeroPregunta} de {cantidadPreguntas}</p>
                </Badge>
            </div>

            {respuesta.pregunta.tipo == EnumTipoPregunta.cerrada?
            
                <div className="p-3 ms-2 me-2">

                    <p className="mb-2">
                        Tu Respuesta
                    </p>
                    <div className="border boder-dark p-3 bg-success rounded d-flex align-content-center mb-3">
                        <p className="fw-bold mb-0">
                            {respuesta.opcion.texto}
                        </p>
                    </div>

                    <p className="mb-2">
                        Todas las opciones disponibles
                    </p>

                    <MostrarOpciones opciones={respuesta.pregunta.opciones}></MostrarOpciones>

                </div>

            : // Si es pregunta abierta  
                
                <div className="p-3 gap-3 d-flex align-items-start mb-3 ms-2 me-2">

                    <Badge bg="secondary" className="p-3">
                        <i  style={{ fontSize: '24px' }} className="fa-regular fa-lightbulb"></i>
                    </Badge>
                    <p className="m-0 fs-4">
                        {respuesta.texto}
                    </p>
                </div>
                
            }
        </>


    )

}

export default RespuestaView;