/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

function EleveDetails({ etudiant, classeId }) {
  // Ajoutez le paramètre classeId
  const { idetudiant } = useParams();
  const [etudiantDetail, setEtudiantDetail] = useState(null);
  const userId = Cookies.get("userId");
  console.log("userId", userId, "idetudiant", idetudiant);

  useEffect(() => {
    const fetchEleveDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/etudiants/${idetudiant}`
        );
        setEtudiantDetail(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'étudiant :", error);
      }
    };

    fetchEleveDetails();
  }, [idetudiant]);

  if (!etudiantDetail) {
    return <LoadingSpinner />;
  } else {
    return (
      <div>
        <div className="EleveDetails">
          <h2>Détails de l'étudiant</h2>
          <p>
            Nom : {etudiantDetail.nom} {etudiantDetail.prenom}
          </p>
          <p>Age : {etudiantDetail.eleve_age}</p>
          <p>Classe : {etudiantDetail.classe_id}</p>
        </div>
        <a href={`/classes/${etudiantDetail.classe_id}`}>Retour à la classe</a>
      </div>
    );
  }
}

export default EleveDetails;
