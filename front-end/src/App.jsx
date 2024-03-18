/** @format */

import { useState } from "react";
import Login from "./components/login/Login";
import Cookies from "js-cookie";
import Home from "./components/Home";
import ClasseDetails from "./components/ClasseDetails";
import EleveDetails from "./components/EleveDetails";
import "./style/App.css";
import Header from "./components/Header";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import FormationDetails from "./components/FormationDetails";

function App() {
  const isLoggedIn = Cookies.get("isLoggedIn") === "true";
  if (isLoggedIn === true) {
    return (
      <div className="app-container">
        <Header />

        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/logout" element={<h1>Logout</h1>} />
            <Route
              path="/formations/:idformation"
              element={<FormationDetails />}
            />
            <Route path="/classes/:idclasse" element={<ClasseDetails />} />
            <Route path="/etudiants/:idetudiant" element={<EleveDetails />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Router>
      </div>
    );
  } else return <Login />;
}

export default App;
