/** @format */

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import "./style/App.scss";
import Header from "./components/Header";
import Home from "./components/Home";
import FormationDetails from "./components/FormationDetails";
import ClasseDetails from "./components/ClasseDetails";
import EleveDetails from "./components/EleveDetails";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import AjouterEleve from "./components/Add/AjouterEleve";
import AjouterFormation from "./components/Add/AjouterFormation";
import AjouterClasse from "./components/Add/AjouterClasse";


function App() {
  const isLoggedIn = Cookies.get("isLoggedIn") === "true";

  return (
    <div className="app-container">
      <Header />
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/logout" element={<h1>Logout</h1>} />
              <Route
                path="/formations/:idformation"
                element={<FormationDetails />}
              />
              <Route path="/classes/:idclasse" element={<ClasseDetails />} />
              <Route path="/etudiants/:idetudiant" element={<EleveDetails />} />
              <Route path="/classes/:idclasse/AjouterEleve" element={<AjouterEleve />} />
              <Route path="/ajouter-formation" element={<AjouterFormation />} />
              <Route path="/formation/:idformation/AjouterClasse" element={<AjouterClasse />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
