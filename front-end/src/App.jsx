/** @format */

import { useState } from "react";
import Login from "./components/login/Login";
import Cookies from "js-cookie";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import Trombinoscope from "./components/Trombinoscope";

function App() {
  const isLoggedIn = Cookies.get("isLoggedIn") === "true";
  const handleLogout = () => {
    const emailCookie = Cookies.get("email");
    Cookies.remove("isLoggedIn");
    Cookies.remove("email");
    window.location.reload();
  };

  if (isLoggedIn === true) {
    return (
      <div className="App">
        <p>Vous êtes connecté !</p>
        <button onClick={handleLogout}>Déconnexion</button>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/logout" element={<h1>Logout</h1>} />
            <Route path="/trombinoscope" element={<Trombinoscope />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Router>
      </div>
    );
  } else return <Login />;
}

export default App;
