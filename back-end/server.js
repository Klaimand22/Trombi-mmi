/** @format */

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors()); // permet à n'importe quelle origine d'accéder à notre API
app.use(bodyParser.urlencoded({ extended: true })); // pour parser les requêtes POST

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
  console.log(
    "Requête GET reçue sur /login" + req.query.email + req.query.pass
  );

  const email = req.query.email;
  const pass = req.query.pass;

  console.log("Email :", email);
  console.log("Mot de passe :", pass);

  const sql = `SELECT * FROM users WHERE email = '${email}' AND pass = '${pass}'`;
  db.query(sql, [email, pass], (err, result) => {
    if (err) {
      console.error("Erreur lors de la requête SQL pour la connexion :", err);
      res.status(500).send("Une erreur s'est produite lors de la connexion.");
    } else {
      if (result.length > 0) {
        res.status(200).send("Connexion réussie !");
        console.log("Connexion réussie !");
      } else {
        res.status(401).send("Identifiants invalides.");
      }
    }
  });
});

app.get("/students", (req, res) => {
  const email = "test@gmail.com";
  const pass = "test";
  const sql = `SELECT * FROM users WHERE email = '${email}' AND pass = '${pass}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants :", err);
      res
        .status(500)
        .send(
          "Une erreur s'est produite lors de la récupération des étudiants."
        );
    } else {
      res.status(200).send(result);
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
