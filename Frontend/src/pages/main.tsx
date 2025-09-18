import { Container } from 'react-bootstrap';
import '../styles/Main.css';

export default function Main() {
    return (
        <Container className="main-container">
            <div className="bienvenida-card">
                <div className="icono-bienvenida">
                    <i className="bi bi-clipboard-data"></i>
                </div>
                    <h1 className="titulo">
                        Bienvenido al Sistema de Encuestas de los Alumnos
                    </h1>
                    <p className="parrafo">
                        Sistema integral para la gestión de encuestas estudiantiles
                    </p>
                </div>
        </Container>
    );
}