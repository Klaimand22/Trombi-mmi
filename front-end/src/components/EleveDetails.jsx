import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import Swal from "sweetalert2";
import { useParams, } from "react-router-dom";
// sauvegarder les paramètres de l'url dans une variable



function EleveDetails({ etudiant, classeId }) {
  const { idetudiant } = useParams();
  const [etudiantDetail, setEtudiantDetail] = useState(null);
  const [imageURL, setImageURL] = useState(null); // État pour stocker l'URL de l'image
  const userId = Cookies.get("userId");


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

  const handleDelete = async () => {
    // Afficher une boîte de dialogue de confirmation avant de supprimer l'étudiant
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post (`http://localhost:3001/etudiants/${idetudiant}/delete`);
        Swal.fire("Supprimé!", "L'étudiant a été supprimé avec succès.", "success");
        // revenir en arrière et recharger la page
        window.history.back();

      } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        Swal.fire("Erreur!", "Une erreur s'est produite lors de la suppression de l'étudiant.", "error");
      }
    }
  };

  if (!etudiantDetail) {
    return <LoadingSpinner />;
  } else {
    /* stocker la colonne image_base64 dans une variable */
    const imageBase64 = etudiantDetail.image_base64;
    return (
      <div className="app-size">
        <div className="EleveDetails">
          <h2>Détails de l'étudiant</h2>
          <img src={`${imageBase64}`} alt="photo" className="image-details" width={200} height={200} />
          <h2>
            Nom : {etudiantDetail.nom}
            <br />
            Prénom : {etudiantDetail.prenom}
          </h2>
        </div>
        <button onClick={handleDelete}>Supprimer l'étudiant</button>
        <a href={`/classes/${etudiantDetail.classe_id}`}>Retour à la classe</a>
      </div>
    );
  }
}

export default EleveDetails;
