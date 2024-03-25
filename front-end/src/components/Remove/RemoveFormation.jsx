import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

function RemoveFormation({ idformation }) {
  const userId = Cookies.get("userId");

  const handleSubmit = () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir quitter la formation ? Vous ne pourrez plus accéder aux informations de la formation."
    );

    if (confirmation) {
      axios
        .post("http://localhost:3001/remove-formation-utilisateur", {
          userId,
          idformation,
        })
        .then((response) => {
          console.log("Formation quittée avec succès :", response.data);
          // renvoyer l'utilisateur vers la page d'accueil
          window.location.href = "/home";
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de la formation :",
            error
          );
          alert("Erreur lors de la suppression de la formation");
        });
    }
  };

  return (

      <a type="button" onClick={handleSubmit}>
        Quitter la formation
      </a>

  );
}

export default RemoveFormation;
