/** @format */

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const AjouterFormation = () => {
  const [nomFormation, setNomFormation] = useState("");
  const [ville, setVille] = useState("");
  const [adresse, setAdresse] = useState("");
  const [pays, setPays] = useState("");
  const { formation_id } = useParams();
  const userId = Cookies.get("userId");

  const handleNomFormationChange = (event) => {
    setNomFormation(event.target.value);
  };

  const handleVilleChange = (event) => {
    setVille(event.target.value);
  };

  const handleAdresseChange = (event) => {
    setAdresse(event.target.value);
  };

  const handlePaysChange = (event) => {
    setPays(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/ajouter-formation",
        {
          nom: nomFormation,
          ville: ville,
          adresse: adresse,
          pays: pays,
        }
      );
      console.log("Formation ajoutée avec succès :", response.data);
      // Réinitialiser les champs du formulaire après soumission réussie
      setNomFormation("");
      setVille("");
      setAdresse("");
      setPays("");

      // afficher un message de succès
      alert("Formation ajoutée avec succès !");

      // ajouter l'utilisateur à la formation
      const formationId = response.data.formation_id;
      const userId = Cookies.get("userId");
      const response2 = await axios.post(
        "http://localhost:3001/ajouter-formation-utilisateur",
        {
          userId,
          formationId,
        }
      );
      console.log(
        "Formation ajoutée à l'utilisateur avec succès :",
        response2.data
      );
      // renvoyer l'utilisateur vers la page d'accueil
      window.location.href = "/home";
    } catch (error) {
      console.error("Erreur lors de l'ajout de la formation :", error);
    }
  };

  return (
    <div className="app-component">
      <div className="app-size">
        <h1>Ajouter une formation</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={nomFormation}
              onChange={handleNomFormationChange}
              placeholder="Nom de la formation"
              required="required"
            />
            <input
              type="text"
              value={ville}
              onChange={handleVilleChange}
              placeholder="Ville"
              required="required"
            />
            <input
              type="text"
              value={adresse}
              onChange={handleAdresseChange}
              placeholder="Adresse"
              required="required"
            />
            <input
              type="text"
              value={pays}
              onChange={handlePaysChange}
              placeholder="Pays"
            />
            <button type="submit">Ajouter</button>
          </div>
        </form>
        <a href="/home" className="button">
          Retour
        </a>
      </div>

      {/* Bouton retour */}
    </div>
  );
};

export default AjouterFormation;
