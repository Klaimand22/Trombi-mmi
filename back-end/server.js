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

/* ------------------------------Récuperation des utilisateurs----------------------------- */
app.get("/login", (req, res) => {
  const email = req.query.email;
  const pass = req.query.pass;
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${pass}'`;
  db.query(sql, [email, pass], (err, result) => {
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
          prenom: result[0].prenom,
        });
      } else {
        res.status(401).send("Identifiants invalides.");
      }
    }
  });
});

/* ------------------------------Inscription----------------------------- */
app.get("/register", (req, res) => {
  const prenom = req.query.prenom;
  const nom = req.query.nom;
  const email = req.query.email;
  const password = req.query.password;

  // Vérifier si l'email est déjà utilisé
  const checkEmailQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(
        "Erreur lors de la vérification de l'adresse e-mail :",
        checkErr
      );
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la vérification de l'adresse e-mail.",
        details: checkErr.message,
      });
    }

    // Vérifier si l'email est déjà utilisé
    if (checkResult[0].count > 0) {
      return res.status(400).json({
        error: true,
        message: "Adresse e-mail déjà utilisée. Veuillez en choisir une autre.",
      });
    }

    // Si l'email n'est pas déjà utilisé, procéder à l'inscription
    const sql = `INSERT INTO users (prenom, nom, email, password) VALUES (?, ?, ?, ?)`;
    db.query(sql, [prenom, nom, email, password], (insertErr, result) => {
      if (insertErr) {
        console.error("Erreur lors de l'inscription :", insertErr);
        return res.status(500).json({
          error: true,
          message: "Une erreur s'est produite lors de l'inscription.",
          details: insertErr.message,
        });
      }
      res.status(200).json({ message: "Inscription réussie !" });
      console.log(prenom + " " + nom + " " + email + " " + password);
    });
  });
});
/* ------------------------------Récuperation des étudiants----------------------------- */

app.get("/students", (req, res) => {
  const sql = `SELECT * FROM student`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération des étudiants.",
        details: err.message, // Cette ligne fournit plus de détails sur l'erreur
      });
    }
    // Si aucune erreur n'est survenue, renvoyer les données des étudiants
    res.status(200).json(result);
  });
});

/*  ------------------------------Récuperation des formations----------------------------- */

app.get("/formations", (req, res) => {
  const userId = req.query.userId;
  const sql = `SELECT * FROM users_formations JOIN formations ON users_formations.formation_id = formations.formation_id WHERE users_formations.user_id = ${userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des formations :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération des formations.",
        details: err.message,
      });
    }
    res.status(200).json(result);
  });
});

/* ------------------------------Récuperation des détails de formation----------------------------- */

app.get("/formations/:idformation", (req, res) => {
  const idformation = req.params.idformation;
  const sql = `SELECT * FROM formations WHERE formation_id = ${idformation}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération de la formation :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération de la formation.",
        details: err.message,
      });
    }
    res.status(200).json(result[0]);
  });
});

/* ------------------------------Récuperation des classes----------------------------- */

app.get("/classes", (req, res) => {
  const formationId = req.query.formationId;
  const sql = `SELECT * FROM classes WHERE formation_id = ${formationId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des classes :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération des classes.",
        details: err.message,
      });
    }
    res.status(200).json(result);
  });
});

/* ------------------------------Récuperation des détails de classe----------------------------- */

app.get("/classes/:idclasse", (req, res) => {
  const idclasse = req.params.idclasse;
  const sql = `SELECT * FROM classes WHERE classe_id = ${idclasse}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération de la classe :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération de la classe.",
        details: err.message,
      });
    }
    res.status(200).json(result[0]);
  });
});

/* ------------------------------Récuperation des étudiants----------------------------- */

app.get("/etudiants", (req, res) => {
  const classeId = req.query.classeId; // Utilisation de req.query pour récupérer le paramètre de requête
  const sql = `SELECT * FROM eleves WHERE classe_id = ${classeId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération des étudiants.",
        details: err.message,
      });
    }
    res.status(200).json(result);
  });
});

/* ------------------------------Récuperation des détails d'un étudiant----------------------------- */
app.get("/etudiants/:idetudiant", (req, res) => {
  const idetudiant = req.params.idetudiant;
  const sql = `SELECT * FROM eleves WHERE eleve_id = ?`;
  db.query(sql, [idetudiant], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'étudiant :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la récupération de l'étudiant.",
        details: err.message,
      });
    }
    res.status(200).json(result[0]);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
