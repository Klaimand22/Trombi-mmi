/** @format */

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Composant principal
function CodePartage() {
  const [error, setError] = useState("");
  const [shareCode, setShareCode] = useState(""); // État pour stocker le code de partage
  const userId = Cookies.get("userId");

  // Fonction pour gérer la soumission du formulaire de code de partage
  const handleShareCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Vérifier la validité du code de partage
      const response = await axios.post(
        "http://localhost:3001/verify-share-code",
        {
          shareCode,
        }
      );
      if (response.status === 200) {
        const formationId = response.data.formationId;

        const response2 = await axios.post(
          "http://localhost:3001/ajouter-formation-utilisateur",
          {
            userId,
            formationId,
          }
        );

        if (response2.status === 200) {
          console.log("Formation ajoutée avec succès !");
          window.location.reload();
        } else {
          setError("Erreur lors de l'ajout de la formation à l'utilisateur");
        }
      } else {
        setError("Code de partage invalide");
      }
    } catch (error) {
      setError("Erreur lors de la vérification du code de partage");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <form onSubmit={handleShareCodeSubmit}>
        <div>
          <input
            type="text"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value)}
            placeholder="code de partage"
          />
        </div>
        <button type="submit">Utiliser le code de partage</button>
      </form>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Affichage de l'erreur */}
    </div>
  );
}

export default CodePartage;
