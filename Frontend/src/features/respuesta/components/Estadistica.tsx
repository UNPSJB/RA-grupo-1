import { Badge, Button, ListGroup} from "react-bootstrap"
import { useEffect, useState } from "react"
import { EnumTipoPregunta, type GrupoPregunta, type Instrumento, type Pregunta} from "../types"
import { ModalRespuestasAbiertas } from "./ModalRespuestasAbiertas"

// Usado para probar - Eliminar
export function Llamadora({id_instrumento} :{id_instrumento : number}){

    const [instrumento, setInstrumento] = useState<Instrumento>()
    const url_base = `http://127.0.0.1:8000/instrumentos/${id_instrumento}/detail`
    
    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())    
        .then((data) => setInstrumento(data))
        .catch((err) => console.log(err))

    }, [])

    return(
        instrumento? <VerPorcentajes instrumento={instrumento}></VerPorcentajes> : <></>
        
    )

}


export function VerPorcentajes({instrumento} : {instrumento : Instrumento}){

    const [respuestasMostradas, setRespuestasMostradas] = useState<Pregunta[]>([])
    const [mostrar, setMostrar] = useState(false)
    const todasLasRespuestas = instrumento?.respuestas_formulario.flatMap((respuestaFormulario) => respuestaFormulario.respuestas);

    useEffect(() => {
        if(instrumento){
            const grupos = obtenerGrupos()
            if(grupos.length > 0){ 
                
                const primerGrupo = grupos[0];
                setRespuestasMostradas(instrumento.plantilla_formulario.preguntas.filter((pregunta) => pregunta.grupo_pregunta.id === primerGrupo.id));
            
            }
    }}, [instrumento]);

    function obtenerCantRespuestasOpcion(id_pregunta : number, id_opcion : number){
        
        return todasLasRespuestas.filter((respuesta) => respuesta.pregunta.id == id_pregunta && respuesta.opcion.id == id_opcion).length
    }

    function obtenerCantRespuestas(id_pregunta : number){
        return todasLasRespuestas.filter((respuesta) => respuesta.pregunta.id == id_pregunta).length
    }

    
    function obtenerGrupos(){

        let grupos: GrupoPregunta[] = [];
        let grupos_ids: number[] = [];

        instrumento?.plantilla_formulario.preguntas.map((pregunta) => {
            if(!grupos_ids.includes(pregunta.grupo_pregunta.id)){
                grupos.push(pregunta.grupo_pregunta)
                grupos_ids.push(pregunta.grupo_pregunta.id)
            }}
        )

        return grupos
    }


    return(

        <div className="container border rounded p-3">
                <div className="d-flex align-items-end justify-content-between m-3">
                    <h3><i className="fa-solid fa-graduation-cap m-3"></i> Respuestas de los estudiantes </h3>
                    <h4> {instrumento?.plantilla_formulario.preguntas.length} preguntas</h4>
                </div>

                <div className="choose-group d-flex gap-3 m-3">

                    {obtenerGrupos().map((grupo) => 
                        <Button key={grupo.id} onClick={() => setRespuestasMostradas( instrumento?.plantilla_formulario.preguntas.filter((pregunta) => pregunta.grupo_pregunta.id === grupo.id) ?? [] )}>

                            Grupo {grupo.letra}
                        </Button>

                    )}

                </div>

                {respuestasMostradas.map((pregunta, numero) => 
                <ListGroup key={pregunta.id} className="border p-3 mb-3" > 
                    <div className="d-flex gap-3">

                        <Badge className="p-2 align-content-center">
                            {pregunta.grupo_pregunta.letra}{numero + 1}
                        </Badge>

                        <Badge className="p-2 align-content-center">
                            Pregunta {pregunta.tipo}
                        </Badge>
                    </div>
                    <p className="mb-3 mt-3">
                        {pregunta.texto}
                    </p>

                    {pregunta.tipo == EnumTipoPregunta.cerrada.toLowerCase()? (
                        
                        pregunta.opciones.map((opcion) =>
                            <ListGroup.Item key={opcion.id} className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">

                                <p className="mb-0">{opcion.texto} </p>
                                <div className="d-flex gap-3">
                                    <p className="mb-0">
                                        ({obtenerCantRespuestasOpcion(pregunta.id, opcion.id) ?? 0} respuestas)
                                    </p>
                                <Badge className="p-2">
                                    {((obtenerCantRespuestasOpcion(pregunta.id, opcion.id) ?? 0)  * 100) / obtenerCantRespuestas(pregunta.id)}%
                                </Badge>
                                </div>
                            </ListGroup.Item>   
                        )
                    )
                        :
                        <>
                            {todasLasRespuestas.filter((respuesta) => respuesta.pregunta.id === pregunta.id).slice(0, 3).map((respuesta) => 
                                
                                    respuesta.pregunta.id == pregunta.id && 
                                    <>
                                        <ListGroup.Item className="mb-3 border rounded p-3">
                                            <p className="mb-0">
                                                {respuesta.texto}
                                            </p>
                                        </ListGroup.Item>
                                        
                                    </>
                                )
                            }

                            <Button onClick={() => setMostrar(true)}> Ver todas las respuestas ({obtenerCantRespuestas(pregunta.id)})</Button>
                            
                            {mostrar && 
                                <ModalRespuestasAbiertas ListaRespuestas={todasLasRespuestas} numeroPregunta={numero} pregunta={pregunta} mostrar={mostrar}setMostrar={setMostrar} />
                                
                            }
                        </>
                        }
                </ListGroup>
                ) 
            } 
            </div>
    )
}