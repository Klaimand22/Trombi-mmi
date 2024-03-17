/** @format */
import { useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";


function FormationDetails() {
    const { idformation } = useParams();
    const [formation, setFormation] = useState({});
    const [eleves, setEleves] = useState([]);
    const userId = Cookies.get("userId");
    console.log("userId", userId, "idformation", idformation);

    return (
        <div>
            <h2 className="text-center">Détails de la formation</h2>
            <p>ID de la formation : {idformation}</p>
            <p>Nom de la formation : {formation.nom}</p>
            <p>Nombre d'élèves : {eleves.length}</p>
        </div>
    );


    }
export default FormationDetails;