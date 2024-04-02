/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import RemoveFormation from "./Remove/RemoveFormation";
import ShareFormation from "./ShareFormation";
import Swal from "sweetalert2";
import AjouterClasse from "./Add/AjouterClasse";

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

  return (
    <div>
      <div className="app-size">
        <div className="formation-actions">
          <RemoveFormation idformation={idformation} />
          <ShareFormation code_partage={formation.code_partage} />
        </div>
        <div>
          <h1>{formation.nom}</h1>
          <h2>
            {formation.adresse} - {formation.ville} - {formation.pays}
            <br />
          </h2>
        </div>
        <div className="classes-list">
          {classes.map((classe) => (
            <a key={classe.classe_id} href={`/classes/${classe.classe_id}`}>
              {classe.nom}
            </a>
          ))}
        </div>
        <AjouterClasse idformation={idformation} />
        <a href="/home">Retour à l'accueil</a>
      </div>
    </div>
  );
}

export default FormationDetails;
