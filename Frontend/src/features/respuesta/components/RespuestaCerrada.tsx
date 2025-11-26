import { useEffect, useState } from "react";
import type { Pregunta } from "../types";
import { EnumTipoPregunta } from "../types";
import { Button, Form} from "react-bootstrap";
import RespuestaCerradaView from "./RespuestaCerradaView";

import type { RespuestaCerrada } from "../types";

// Guardar las respuestas
const url_envio = "http://127.0.0.1:8000/respuestas/"

function manejarEnvio(respuestasCerradas : RespuestaCerrada[]){

    respuestasCerradas.map((respuesta) => 
    
        fetch(url_envio, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' // Indica que envías datos JSON
            },
            body: JSON.stringify(respuesta)
        })
    )

}

function ResponderPreguntas(){

    const url_base = "http://127.0.0.1:8000/preguntas/"

    const [preguntas, setPreguntas] = useState<Pregunta[]>([])

    const [respuestas, setRespuestas] = useState<RespuestaCerrada[]>([])

    useEffect(()=> {

        fetch(url_base)
        .then(response => response.json())
        .then((data) => setPreguntas(data))
        .catch(err => console.log(err))
    }, [])

    return(
        <>

            <Form onSubmit={() => manejarEnvio(respuestas)}>
                {preguntas.map((pregunta) =>
                    pregunta.tipo == EnumTipoPregunta.cerrada &&
                    <RespuestaCerradaView pregunta_id = {pregunta.id} respuestas = {respuestas} actualizarRespuestas= {setRespuestas}/>

                )}
                
                <Button variant="primary" type="submit" >
                    Enviar Respuestas
                </Button>
            </Form>
        </>
    )
}

export default ResponderPreguntas;