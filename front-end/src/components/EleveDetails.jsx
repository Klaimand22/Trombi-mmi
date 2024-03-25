import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

function EleveDetails({ etudiant, classeId }) {
  const { idetudiant } = useParams();
  const [etudiantDetail, setEtudiantDetail] = useState(null);
  const [imageURL, setImageURL] = useState(null); // État pour stocker l'URL de l'image
  const userId = Cookies.get("userId");
  console.log("idetudiant", idetudiant);

  useEffect(() => {
    const fetchEleveDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/etudiants/${idetudiant}`);
        setEtudiantDetail(response.data);
        console.log(response.data);
        // Récupérer l'URL de l'image associée à l'élève s'il y en a une
        if (response.data.image_url) {
          setImageURL(response.data.image_url);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'étudiant :", error);
      }
    };

    fetchEleveDetails();
  }, [idetudiant]);

  if (!etudiantDetail) {
    return <LoadingSpinner />;
  } else {
    /* stocker la coloonne image_base64 dans une variable */
    const imageBase64 = etudiantDetail.image_base64;
    return (
      <div>
        <div className="EleveDetails">
          <h2>Détails de l'étudiant</h2>
          <p>
            Nom : {etudiantDetail.nom} {etudiantDetail.prenom}
          </p>
          <p>Classe : {etudiantDetail.classe_id}</p>
          <img src={`${imageBase64}`} alt="photo" width={200} height={200} />
        </div>
        <a href={`/classes/${etudiantDetail.classe_id}`}>Retour à la classe</a>
      </div>
    );
  }
}

export default EleveDetails;
