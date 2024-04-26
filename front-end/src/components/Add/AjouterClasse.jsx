/** @format */
/* test */
import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AjouterClasse({ idformation }) {
  const handleAddClass = () => {
    Swal.fire({
      title: "Ajouter une classe",
      html: `
        <input id="nomClasse" class="swal2-input" placeholder="Nom de la classe" required>
        <input id="descriptionClasse" class="swal2-input" placeholder="Description">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nomClasse = Swal.getPopup().querySelector("#nomClasse").value;
        const descriptionClasse =
          Swal.getPopup().querySelector("#descriptionClasse").value;
        return { nomClasse, descriptionClasse };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const nomClasse = result.value.nomClasse.trim(); // Supprimer les espaces inutiles
        if (nomClasse === "") {
          // Vérifier si le nom de la classe est vide
          Swal.fire(
            "Erreur !",
            "Veuillez saisir un nom pour la classe.",
            "error"
          );
        } else {
          axios
            .post("http://localhost:3001/ajouter-classe", {
              nom: nomClasse,
              description: result.value.descriptionClasse,
              idformation: idformation,
            })
            .then((response) => {
              console.log("Classe ajoutée avec succès :", response.data);
              // Actualiser la liste des classes
              window.location.reload();
              // Afficher une alerte de succès
              Swal.fire(
                "Succès !",
                "La classe a été ajoutée avec succès.",
                "success"
              );
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout de la classe :", error);
              // Afficher une alerte d'erreur
              Swal.fire(
                "Erreur !",
                "Une erreur s'est produite lors de l'ajout de la classe.",
                "error"
              );
            });
        }
      }
    });
  };

  return (
    <div>
      <button type="button" onClick={handleAddClass}>
        Ajouter une classe
      </button>
    </div>
  );
}

export default AjouterClasse;
