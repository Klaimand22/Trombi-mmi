/** @format */

// Register.js

import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const Register = () => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Crypter le mot de passe en MD5
    const hashedPass = CryptoJS.MD5(password).toString();

    try {
      const response = await axios.get("http://localhost:3001/register", {
        params: {
          prenom,
          nom,
          email,
          password: hashedPass,
        },
      });

      console.log(response.data);
      console.log(response.status);

      if (response.status === 400) {
        console.log(
          "Adresse e-mail déjà utilisée. Veuillez en choisir une autre."
        );
        setError(
          "Adresse e-mail déjà utilisée. Veuillez en choisir une autre."
        );
      } else if (response.status === 200) {
        setError("");
        alert("Inscription réussie !");
        window.location.href = "/login";
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <div className="app-size">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" style={{ marginTop: "10px" }}> S'inscrire </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </form>
      <a href="/login" style={{ marginTop: "10px"  }}>Déjà inscrit ? Connectez-vous</a>
    </div>
  );
};

export default Register;
