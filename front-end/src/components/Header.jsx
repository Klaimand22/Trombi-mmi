/** @format */

import React from "react";
import Cookies from "js-cookie";
import "../style/header.scss";

function Header() {
  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("email");
    window.location.reload();
  };

  return (
    <div className="header">
      <h1>My Website</h1>
      <p>Vous êtes connecté !</p>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}

export default Header;
