import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  type ChartOptions 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OpcionPorcentaje {
  opcion_id: string;
  porcentaje: number;
}

export interface CategoriaEstadistica {
  categoria_cod: string;   
  categoria_texto: string; 
  promedio_categoria: OpcionPorcentaje[];
  preguntas: any[];
}

interface Props {
  datosApi: CategoriaEstadistica[];
}

const getSortOrder = (cod: string) => {
  if (cod.startsWith('B')) return 1;
  if (cod.startsWith('C')) return 2;
  if (cod.startsWith('D')) return 3;
  if (cod.startsWith('E(TEORIA)')) return 4;
  if (cod.startsWith('E(PRACTICA)')) return 5;
  if (cod.startsWith('F')) return 6;
  return 99;
};

const getColorParaOpcion = (opcion: string) => {
    const op = opcion.toLowerCase();
    if (op.includes('si') || op.includes('muy bueno')) return '#2e7d32';
    if (op.includes('bueno')) return '#66bb6a';
    if (op.includes('regular') || op.includes('npo')) return '#ffa726';
    if (op.includes('no') || op.includes('malo')) return '#ef5350';
    return '#bdbdbd';
};

export default function GraficoBarrasDocente({ datosApi }: Props) {
  const categoriaMap = new Map<string, string>();
  datosApi.forEach(cat => {
    categoriaMap.set(cat.categoria_cod, cat.categoria_texto);
  });

  const transformarDatosParaGrafico = (datos: CategoriaEstadistica[]) => {  
    let datosFiltrados = datos
      .filter(cat => cat.categoria_cod !== 'G'); 

    datosFiltrados.sort((a, b) => {
      return getSortOrder(a.categoria_cod) - getSortOrder(b.categoria_cod);
    });

    const labels = datosFiltrados.map(cat => cat.categoria_cod); 
    
    const opcionesSet = new Set<string>();
    datosFiltrados.forEach(cat => {
      cat.promedio_categoria.forEach(op => {
        opcionesSet.add(op.opcion_id);
      });
    });
    const opcionesUnicas = Array.from(opcionesSet);

    const datasets = opcionesUnicas.map((opcion) => {
      const data = labels.map(labelCode => { 
        const categoria = datosFiltrados.find(cat => cat.categoria_cod === labelCode);
        const opcionData = categoria?.promedio_categoria.find(op => op.opcion_id === opcion);
        return opcionData ? opcionData.porcentaje : 0;
      });
      return {
        label: opcion,
        data: data,
        backgroundColor: getColorParaOpcion(opcion),
        barPercentage: 0.6,
      };
    });

    return { labels, datasets };
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'bottom' as const,
        labels: { boxWidth: 12, font: { size: 11 } }
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const codigoLabel = tooltipItems[0].label; 
            const textoLargo = categoriaMap.get(codigoLabel) || codigoLabel;
            return `${codigoLabel}: ${textoLargo}`;
          },
          label: (context: any) => ` ${context.dataset.label}: ${context.raw.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: { 
        stacked: true,
        max: 100, 
        grid: { color: '#f0f0f0' },
        ticks: { font: { size: 11 } }
      },
      y: { 
        stacked: true,
        grid: { display: false },
        ticks: { 
            font: { weight: 'bold' as const } 
        }
      },
    },
  };

  const data = transformarDatosParaGrafico(datosApi);

  return <Bar options={options} data={data} />;
};