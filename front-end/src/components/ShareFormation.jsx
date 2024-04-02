/** @format */
import Swal from "sweetalert2";

function ShareFormation({ code_partage }) {
  const shareCode = () => {
    Swal.fire({
      title: "Code de partage",
      text: `Le code de partage de la formation est : ${code_partage}`,
      icon: "info",
      confirmButtonText: "OK",
    });
  };
  return (
    <div>
      <button onClick={shareCode}>Partager le code</button>
    </div>
  );
}

export default ShareFormation;
