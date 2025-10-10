import { Outlet } from "react-router-dom";

export default function Departamento(){
  return (
    <div>
      <h2>Departamento</h2>
      <Outlet /> {/*nada de nada para que ande noma*/}
    </div>
  );
}