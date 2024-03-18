/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

function ClasseDetails() {
  const { idclasse } = useParams();
  const [classe, setClasse] = useState({});
  const [etudiants, setEtudiants] = useState([]);
  const userId = Cookies.get("userId");
  console.log("userId", userId, "idclasse", idclasse);

  const fetchClasse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/classes/" + idclasse
      );
      setClasse(response.data);
      console.log("Classe :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la classe :", error);
    }
  };

  const fetchEtudiants = async () => {
    try {
      const response = await axios.get("http://localhost:3001/etudiants", {
        params: {
          classeId: idclasse,
        },
      });
      setEtudiants(response.data);
      console.log("Etudiants :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants :", error);
    }
  };

  useEffect(() => {
    fetchClasse();
    fetchEtudiants();
  }, []);

  if (Object.keys(classe).length === 0 || etudiants.length === 0) {
    return <LoadingSpinner />;
  } else {
    return (
      <div>
        <h2 className="text-center">Détails de la classe</h2>
        <div>
          <h3>{classe.nom}</h3>
          <p>
            {classe.description}
            <br />
          </p>
        </div>
        <div>
          <h3>Étudiants</h3>
          <ul>
            {etudiants.map((etudiant) => (
              <li key={etudiant.eleve_id}>
                <a href={`/etudiants/${etudiant.classe_id}`}>
                  {etudiant.nom} {etudiant.prenom}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a className="btn-return" href={`/formations/${classe.formation_id}`}>
          Retour à la formation
        </a>
      </div>
    );
  }
}

export default ClasseDetails;
