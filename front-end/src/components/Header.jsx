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
        <h1>My Website</h1>
        <p>Vous n'êtes pas connecté !</p>
      </div>
    );
  }

  if (Cookies.get("isLoggedIn") === "true") {
    return (
      <div className="header">
        <h1>My Website</h1>
        <p>Vous êtes connecté !</p>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    );
  }
}

export default Header;
