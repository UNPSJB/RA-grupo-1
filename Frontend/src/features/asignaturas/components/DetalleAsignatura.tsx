import { useParams, useLocation } from "react-router-dom"

export default function DetalleAsignatura(){
    const { id } = useParams();
    const location = useLocation();
    const nombreAsignatura = location.state?.nombre || "Asignatura";

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h1 className="h4 mb-0"><strong>{id}: </strong>{nombreAsignatura}</h1>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">
                    </div>
                </div>
            </div>
        </div>
     );
}