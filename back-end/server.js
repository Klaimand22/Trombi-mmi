const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "trombi-mmi",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connexion à la base de données réussie !");
});

app.get("/login", (req, res) => {
  const { email, pass } = req.query;
  const sql = `SELECT user_id, nom, prenom FROM Users WHERE email = ? AND password = ?`;
  db.query(sql, [email, pass], (err, result) => {
    if (err) {
      console.error("Erreur lors de la requête SQL pour la connexion :", err);
      res.status(500).send("Une erreur s'est produite lors de la connexion.");
    } else {
      if (result.length > 0) {
        res.status(200).json({
          message: "Connexion réussie !",
          userId: result[0].user_id,
          nom: result[0].nom,
          prenom: result[0].prenom
        });
        console.log("Connexion réussie !");
      } else {
        res.status(401).send("Identifiants invalides.");
      }
    }
  });
});

// Route pour récupérer les formations de l'utilisateur
app.get("/user/formations", (req, res) => {
  const userId = req.query.userId;
  console .log("userId", userId);
  const sql = `
    SELECT formations.*
    FROM formations
    INNER JOIN users_formations ON formations.formation_id = users_formations.formation_id
    WHERE users_formations.user_id = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des formations de l'utilisateur :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des formations de l'utilisateur.",
        details: err.message,
      });
    }
    res.status(200).json(result);
  });
});

app.get("/classes/:idclasse", (req, res) => {
  const idclasse = req.query.idclasse;
  console.log("idclasse", idclasse);
  const sql = `SELECT * FROM eleves WHERE classe_id = ${idclasse}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des élèves de la classe :", err);
      res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de la récupération des élèves de la classe.",
        details: err.message,
      });
    } else {
      res.status(200).json(result);
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
