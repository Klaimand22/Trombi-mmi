"use strict";

/** @format */
var express = require("express");

var mysql = require("mysql");

var cors = require("cors");

var bodyParser = require("body-parser");

var app = express();
app.use(cors()); // permet à n'importe quelle origine d'accéder à notre API

app.use(bodyParser.urlencoded({
  extended: true
})); // pour parser les requêtes POST

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "trombi-mmi"
});
db.connect(function (err) {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }

  console.log("Connexion à la base de données réussie !");
});
app.get("/login", function (req, res) {
  console.log("Requête GET reçue sur /login" + req.query.email + req.query.pass);
  var email = req.query.email;
  var pass = req.query.pass;
  console.log("Email :", email);
  console.log("Mot de passe :", pass);
  var sql = "SELECT * FROM users WHERE email = '".concat(email, "' AND password = '").concat(pass, "'");
  db.query(sql, [email, pass], function (err, result) {
    if (err) {
      console.error("Erreur lors de la requête SQL pour la connexion :", err);
      res.status(500).send("Une erreur s'est produite lors de la connexion.");
    } else {
      if (result.length > 0) {
        // Renvoyer les données de l'utilisateur y compris le nom et le prénom
        res.status(200).json({
          message: "Connexion réussie !",
          userId: result[0].user_id,
          nom: result[0].nom,
          prenom: result[0].prenom
        });
      } else {
        res.status(401).send("Identifiants invalides.");
      }
    }
  });
});
app.get("/students", function (req, res) {
  var sql = "SELECT * FROM student";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des étudiants.",
        details: err.message // Cette ligne fournit plus de détails sur l'erreur

      });
    } // Si aucune erreur n'est survenue, renvoyer les données des étudiants


    res.status(200).json(result);
  });
});
app.get("/formations", function (req, res) {
  var userId = req.query.userId;
  var sql = "SELECT * FROM users_formations JOIN formations ON users_formations.formation_id = formations.formation_id WHERE users_formations.user_id = ".concat(userId);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des formations :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des formations.",
        details: err.message
      });
    }

    res.status(200).json(result);
  });
});
/* ------------------------------Récuperation des détails de formation----------------------------- */

app.get("/formations/:idformation", function (req, res) {
  var idformation = req.params.idformation;
  var sql = "SELECT * FROM formations WHERE formation_id = ".concat(idformation);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération de la formation :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération de la formation.",
        details: err.message
      });
    }

    res.status(200).json(result[0]);
  });
});
/* ------------------------------Récuperation des classes----------------------------- */

app.get("/classes", function (req, res) {
  var formationId = req.query.formationId;
  var sql = "SELECT * FROM classes WHERE formation_id = ".concat(formationId);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des classes :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des classes.",
        details: err.message
      });
    }

    res.status(200).json(result);
  });
});
/* ------------------------------Récuperation des détails de classe----------------------------- */

app.get("/classes/:idclasse", function (req, res) {
  var idclasse = req.params.idclasse;
  var sql = "SELECT * FROM classes WHERE classe_id = ".concat(idclasse);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération de la classe :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération de la classe.",
        details: err.message
      });
    }

    res.status(200).json(result[0]);
  });
});
/* ------------------------------Récuperation des étudiants----------------------------- */

app.get("/etudiants", function (req, res) {
  var classeId = req.params.classeId; // Utilisation de req.query pour récupérer le paramètre de requête

  var sql = "SELECT * FROM eleves WHERE classe_id = ".concat(classeId);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des étudiants.",
        details: err.message
      });
    }

    res.status(200).json(result);
  });
});
/* ------------------------------Récuperation des détails d'un étudiant----------------------------- */

app.get("/etudiants/:idetudiant", function (req, res) {
  var idetudiant = req.params.idetudiant; // Utilisation de req.params pour récupérer l'ID de l'étudiant

  var sql = "SELECT * FROM eleves WHERE eleve_id = ".concat(idetudiant);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération de l'étudiant :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération de l'étudiant.",
        details: err.message
      });
    }

    res.status(200).json(result[0]);
  });
});
var port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log("Serveur en \xE9coute sur le port ".concat(port));
});