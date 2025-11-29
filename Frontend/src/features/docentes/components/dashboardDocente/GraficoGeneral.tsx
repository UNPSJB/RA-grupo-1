import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OpcionPorcentaje {
  opcion_id: string;
  porcentaje: number;
}

interface Props {
  datos: OpcionPorcentaje[];
  cicloActivo: 'basico' | 'superior';
}

export default function GraficoDonaGeneral({ datos, cicloActivo }: Props) {
  const datosLimpios = datos.map(d => ({
    ...d,
    id_compare: d.opcion_id.trim().toLowerCase(),
  }));

const mapaSuperior = [
  { label: 'Muy Bueno', keys: ['muy bueno', 'muy bueno, muy satisfactorio', 'excelente'], color: '#2e7d32' },
  { label: 'Bueno', keys: ['bueno', 'bueno, satisfactorio'], color: '#66bb6a' },
  { label: 'Regular', keys: ['regular', 'regular, poco satisfactorio'], color: '#ffa726' },
  { label: 'Malo', keys: ['malo', 'malo, no satisfactorio'], color: '#ef5350' }
];

  const mapaBasico = [
    { label: 'Si.', keys: ['si', 'si.', 'sí', 'sí.'], color: '#66bb6a' },
    { label: 'No.', keys: ['no', 'no.'], color: '#FF6384' },
    { label: 'NPO.', keys: ['npo', 'npo.', 'ns/nc'], color: '#FFCE56' }
  ];

  const esSuperior = cicloActivo === 'superior';
  const mapa = esSuperior ? mapaSuperior : mapaBasico;
  const datosOrdenados = mapa.map(item => {
    const encontrado = datosLimpios.find(d => item.keys.includes(d.id_compare));
    return {
      opcion_id: item.label,
      porcentaje: encontrado?.porcentaje ?? 0
    };
  });

  const colornames = mapa.map(m => m.color);
  const porcentajePositivo = esSuperior
    ? Math.round(
        (datosOrdenados.find(d => d.opcion_id === 'Muy Bueno')?.porcentaje || 0) +
        (datosOrdenados.find(d => d.opcion_id === 'Bueno')?.porcentaje || 0)
      )
    : Math.round(datosOrdenados.find(d => d.opcion_id === 'Si.')?.porcentaje || 0);

  const data = {
    labels: datosOrdenados.map(d => d.opcion_id),
    datasets: [
      {
        data: datosOrdenados.map(d => d.porcentaje),
        backgroundColor: colornames,
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { boxWidth: 12, font: { size: 10 }, padding: 10 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw.toFixed(1)}%`
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Doughnut data={data} options={options} />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          width: '100%'
        }}
      >
        <h2 className="mb-0 fw-bold text-secondary">{porcentajePositivo}%</h2>
        <small className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
          {esSuperior ? 'POSITIVO' : 'APROBACIÓN'}
        </small>
      </div>
    </div>
  );
}