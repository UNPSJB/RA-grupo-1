import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form"
import type { Pregunta } from "../types";
import type {RespuestaCerrada} from "../types";

function manejarSeleccion(opcion : number, {pregunta_id, respuestas, actualizarRespuestas} : Props ){

    const nuevaRespuesta: RespuestaCerrada = {
        pregunta_id: pregunta_id,
        opcion_id:  opcion,
    }

    let nuevaLista = respuestas.filter(item => item.pregunta_id !== pregunta_id);
    nuevaLista.push(nuevaRespuesta);
    actualizarRespuestas(nuevaLista);

}

type Props = {
    pregunta_id : number,
    respuestas : RespuestaCerrada[]
    actualizarRespuestas: (valor : RespuestaCerrada[]) => void;

}


function RespuestaCerradaView({pregunta_id, respuestas, actualizarRespuestas} : Props){
    

    const url_base = `http://127.0.0.1:8000/preguntas/${pregunta_id}`;

    const [pregunta, setPregunta] = useState<Pregunta>({
        id: 0,
        texto: "",
        opciones: [],
        tipo: null
    });

    useEffect(() => {
        fetch(url_base) 
        .then(response => response.json())
        .then((data) => setPregunta(data))
        .catch(error => console.log(error))
    }, []);


    return(
        
        <div className={`question-$pregunta.id`}>
            
            <h3>{pregunta.texto}</h3>
            <Form.Group aria-required>
                <Form.Label > Seleccione una opcion... </Form.Label>
                    <ListGroup>
                        {pregunta.opciones.map((opcion) =>

                            <ListGroup.Item > 
                                <Form.Check required type="radio" name={`answers-question-${pregunta.id}`} onChange={() => manejarSeleccion(opcion.id, {pregunta_id, respuestas, actualizarRespuestas})} label={opcion.texto}/>
                            </ListGroup.Item>    
                            
                        )}
                </ListGroup>
            </Form.Group>
        </div>
    )
    
}

export default RespuestaCerradaView;