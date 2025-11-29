import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  completadas: number;
  totalAlumnos: number;
}

export default function GraficoParticipacion({ completadas, totalAlumnos }: Props) {
  const pendientes = Math.max(0, totalAlumnos - completadas);
  const porcentaje = totalAlumnos > 0 ? Math.round((completadas / totalAlumnos) * 100) : 0;

  const data = {
    labels: ['Encuestas Recibidas', 'Sin Responder'],
    datasets: [
      {
        data: [completadas, pendientes],
        backgroundColor: ['#0d6efd', '#e9ecef'],
        hoverBackgroundColor: ['#0b5ed7', '#dee2e6'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
            label: function(context: any) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value} alumnos`;
            }
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '160px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '160px', height: '160px', position: 'relative' }}>
          <Doughnut data={data} options={options} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <h3 className="mb-0 fw-bold text-primary">{porcentaje}%</h3>
            <small className="text-muted text-uppercase" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
              Participación
            </small>
          </div>
      </div>
    </div>
  );
}