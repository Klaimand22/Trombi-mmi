/** @format */

import React from "react";
import Cookies from "js-cookie";
import "../style/header.scss";

function Header() {
  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("email");
    Cookies.remove("nom");
    Cookies.remove("prenom");
    Cookies.remove("userId");
    window.location.reload();
  };

  if (Cookies.get("isLoggedIn") !== "true") {
    return (
      <div className="header">
        <p>Vous n'êtes pas connecté !</p>
      </div>
    );
  }

  if (Cookies.get("isLoggedIn") === "true") {
    return (
      <div className="header">
        <div className="name">
        <h1> Bienvenue</h1>
        <h2>{Cookies.get("prenom")} {Cookies.get("nom")}</h2>
        </div>
        <div className="menu">
        <button onClick={handleLogout}>Déconnexion</button>

        </div>
      </div>
    );
  }
}

export default Header;
