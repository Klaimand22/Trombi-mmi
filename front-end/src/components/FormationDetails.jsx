import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";
import RemoveFormation from "./Remove/RemoveFormation";

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

  if (classes.length === 0) {
    return (
      <div>
        <h2 className="text-center">Détails de la formation</h2>
        <RemoveFormation idformation={idformation} />
        <div>
          <h3>{formation.nom}</h3>
          <h4>Code de partage : {formation.code_partage}</h4>
          <p>
            {formation.adresse} - {formation.ville} - {formation.pays}
            <br />
          </p>
        </div>
        <a
          href={`/formation/${idformation}/AjouterClasse?nom=${formation.nom}&ville=${formation.ville}`}
        >
          {" "}
          Ajouter une classe
        </a>
        {/* bouton retour  */}
        <a href="/home">Retour à l'accueil</a>
      </div>
    );
  } else {
    return (
      <div className="app-size">
        <div>
          <RemoveFormation idformation={idformation} />
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
        <a
          href={`/formation/${idformation}/AjouterClasse?nom=${formation.nom}&ville=${formation.ville}`}
        >
          {" "}
          Ajouter une classe
        </a>
        {/* bouton retour  */}
        <a href="/home">Retour à l'accueil</a>
      </div>
    );
  }
}

export default FormationDetails;
