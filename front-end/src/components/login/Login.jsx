/** @format */

import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginResult, setLoginResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPass = CryptoJS.MD5(pass).toString();
    console.log("Email :", email);
    console.log("Mot de passe :", pass);
    console.log("Mot de passe hashé :", hashedPass);
    try {
      const response = await axios.get(
        "http://localhost:3001/login?email=" + email + "&pass=" + hashedPass
      );

      if (response.status === 200) {
        // Enregistrement de la session dans les cookies
        console.log("Réponse de la requête Axios :", response);
        /* decomposer la réponse et récuperer le nom, le prénom, l'adresse mail */
        const { nom, prenom, userId } = response.data;
        Cookies.set("isLoggedIn", true);
        Cookies.set("email", email);
        Cookies.set("nom", nom);
        Cookies.set("prenom", prenom);
        Cookies.set("userId", userId);
        setLoginResult("Connexion réussie !");
        /* redirger vers /home */
        window.location.href = "/home";
      } else {
        setLoginResult("Identifiants invalides.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      console.log("Détails de l'erreur Axios :", error.response);
      setLoginResult("Une erreur s'est produite lors de la connexion.");
    }
  };

  const isLoggedIn = Cookies.get("isLoggedIn") === "true";
  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("email");
    window.location.reload();
  };

  return (
    <div>
      <h1>Connexion</h1>
      {isLoggedIn ? (
        <div>
          <p>Vous êtes connecté !</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="pass">Mot de passe</label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
      )}
      {loginResult && (
        <div>
          <h2>Résultat de la connexion :</h2>
          <p>{loginResult}</p>
        </div>
      )}

      <div>
        <h2>Créer un compte</h2>
        <a href="/register">S'inscrire</a>
      </div>
    </div>
  );
}

export default Login;
