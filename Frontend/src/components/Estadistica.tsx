import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
  title?: string;
}

export function Estadistica({ labels, data, title = "Estadística" }: Props) {
  const defaultLabels = ["Sí", "No", "NPO"];
  const displayLabels = labels?.length ? labels : defaultLabels;
  const displayData = data?.length ? data : [0, 0, 0];
  const isEmpty = displayData.every((v) => v === 0);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="fw-bold">{title}</Card.Header>
      <Card.Body>
        {isEmpty && <small className="text-muted d-block mb-3">No hay respuestas cargadas aún.</small>}
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <Pie
            data={{
              labels: displayLabels,
              datasets: [
                {
                  data: displayData,
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
                },
              ],
            }}
            options={{
              plugins: { legend: { position: "bottom" } },
              maintainAspectRatio: true,
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
