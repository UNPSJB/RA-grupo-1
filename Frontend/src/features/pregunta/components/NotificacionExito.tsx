interface Props {
  notificacion: string;
  onClose: () => void;
}

export default function NotificacionExito({ notificacion, onClose }: Props) {
  return (
    <div className="alert alert-success d-flex justify-content-between align-items-center">
      <span>{notificacion}</span>
      <button className="btn-close" onClick={onClose}></button>
    </div>
  );
}