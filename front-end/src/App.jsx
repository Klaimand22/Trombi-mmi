/** @format */

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import "./style/App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import FormationDetails from "./components/FormationDetails";
import ClasseDetails from "./components/ClasseDetails";
import EleveDetails from "./components/EleveDetails";
import Login from "./components/login/Login";
import Register from "./components/login/Register";

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
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
