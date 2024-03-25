import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AjouterClasse() {
  const { idformation } = useParams();
  const [nomFormation, setNomFormation] = useState("");
  const [villeFormation, setVilleFormation] = useState("");

  // Fonction pour obtenir les paramètres de l'URL
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Appel de la fonction pour récupérer les paramètres nom et ville
  const nom = getParameterByName("nom");
  const ville = getParameterByName("ville");

  // Gestion de la soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault();
    const nomClasse = e.target[0].value;
    const description = e.target[1].value;
    console.log(nomClasse, description, idformation);

    try {
      const response = await axios.post("http://localhost:3001/ajouter-classe", {
        nom: nomClasse,
        description: description,
        idformation: idformation,
      });
      if (response.status === 200) {
        alert("Classe ajoutée avec succès !");
        window.location.href = `/formations/${idformation}`;
      }
    }
    catch (error) {
      console.error("Erreur lors de l'ajout de la classe :", error);
    }
    }

  return (
    <div>
      <h1>
        Ajouter une classe à la formation {nomFormation} à {villeFormation}
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de la classe :</label>
          <input type="text" />
        </div>
        <div>
          <label>Description :</label>
          <input type="text" />
        </div>
        <button type="submit">Ajouter</button>
      </form>
      <a href={`/formations/${idformation}`}>Retour à la formation {nom}</a>
    </div>
  );
}

export default AjouterClasse;
