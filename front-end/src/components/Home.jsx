/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "../style/Home.scss";
import CodePartage from "./CodePartage";

const nom = Cookies.get("nom");
const prenom = Cookies.get("prenom");
const userId = Cookies.get("userId");
console.log("userId", userId, "nom", nom, "prenom", prenom);

function Home() {
  // État pour stocker l'ID de la formation sélectionnée
  const [selectedFormation, setSelectedFormation] = useState("");
  // État pour stocker la liste des formations de l'utilisateur
  const [userFormations, setUserFormations] = useState([]);

  // Fonction pour récupérer les formations de l'utilisateur
  const fetchUserFormations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/formations?userId=" + userId
      );
      setUserFormations(response.data);
      console.log("Formations de l'utilisateur :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des formations :", error);
    }
  };

  // Appel de la fonction de récupération des formations de l'utilisateur au chargement du composant
  useEffect(() => {
    fetchUserFormations();
  }, []);

  return (
    <div className="app-size" style={{ textAlign: "center" }}>

        <h1>Vos formations</h1>
        <div className="formations-grid">
          {userFormations.map((formation) => (
            <a
              key={formation.formation_id}
              href={`/formations/${formation.formation_id}`}
              className="card"
              onClick={() => setSelectedFormation(formation.formation_id)}
            >
              {formation.nom} <br></br>-<br></br> {formation.ville}
            </a>
          ))}
        </div>
        <CodePartage />
        <a href="/ajouter-formation"> Ajouter une formation</a>
    </div>

  );
}

export default Home;
