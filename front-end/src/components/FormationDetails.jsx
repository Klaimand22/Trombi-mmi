/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

function FormationDetails() {
  const { idformation } = useParams();
  const [formation, setFormation] = useState({});
  const [classes, setClasses] = useState([]);
  const userId = Cookies.get("userId");
  console.log("userId", userId, "idformation", idformation);

  const fetchFormation = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/formations/" + idformation
      );
      setFormation(response.data);
      console.log("Formation :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la formation :", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/classes?formationId=" + idformation
      );
      setClasses(response.data);
      console.log("Classes :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des classes :", error);
    }
  };

  useEffect(() => {
    fetchFormation();
    fetchClasses();
  }, []);

  if (Object.keys(formation).length === 0 || classes.length === 0) {
    return <LoadingSpinner />;
  } else {
    return (
      <div>
        <h2 className="text-center">Détails de la formation</h2>
        <div>
          <h3>{formation.nom}</h3>
          <p>
            {formation.adresse} - {formation.ville} - {formation.pays}
            <br />
          </p>
        </div>
        <div>
          <h3>Classes</h3>
          <ul>
            {classes.map((classe) => (
              <a key={classe.classe_id} href={`/classes/${classe.classe_id}`}>
                <li>{classe.nom}</li>
              </a>
            ))}
          </ul>
        </div>
        {/* bouton retour  */}
        <a href="/home">Retour à l'accueil</a>
      </div>
    );
  }
}

export default FormationDetails;
