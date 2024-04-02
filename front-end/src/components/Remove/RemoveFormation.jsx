/** @format */

import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function RemoveFormation({ idformation }) {
  const userId = Cookies.get("userId");

  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir quitter la formation ?",
      text: "Vous ne pourrez plus accéder aux informations de la formation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, quitter la formation",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:3001/remove-formation-utilisateur", {
            userId,
            idformation,
          })
          .then((response) => {
            console.log("Formation quittée avec succès :", response.data);
            // Afficher une alerte de succès
            Swal.fire(
              "Formation quittée !",
              "Vous avez quitté la formation avec succès.",
              "success"
            );
            // renvoyer l'utilisateur vers la page d'accueil
            window.location.href = "/home";
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la suppression de la formation :",
              error
            );
            // Afficher une alerte d'erreur
            Swal.fire(
              "Erreur !",
              "Une erreur s'est produite lors de la suppression de la formation.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div>
      <button className="color-red" type="button" onClick={handleDelete}>
        Quitter la formation
      </button>
    </div>
  );
}

export default RemoveFormation;
