/** @format */

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
express.urlencoded({ extended: true });

app.use(cors()); // permet à n'importe quelle origine d'accéder à notre API

const db = mysql.createConnection({
  host: "mysql-klaimand.alwaysdata.net",
  user: "klaimand_trombi",
  password: "klaimandMMI",
  database: "klaimand_trombi",
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
    });
  });
});

/* ------------------------------Récuperation des étudiants----------------------------- */

app.get("/students", (req, res) => {
  const sql = `SELECT * FROM eleves`;
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

/* ------------------------------Récuperation des formations la ou l'utilisateur n'est pas inscrit----------------------------- */

app.get("/liste-formation", (req, res) => {
  const sql = `SELECT * FROM formations WHERE formation_id NOT IN (SELECT formation_id FROM users_formations WHERE user_id = ${req.query.userId})`;
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

/* ------------------------------Ajout d'une formation à un utilisateur----------------------------- */

app.post("/ajouter-formation-utilisateur", (req, res) => {
  const { userId, formationId } = req.body;
  const sql = `INSERT INTO users_formations (user_id, formation_id) VALUES (?, ?)`;
  db.query(sql, [userId, formationId], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de l'ajout de la formation à l'utilisateur :",
        err
      );
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de l'ajout de la formation à l'utilisateur.",
        details: err.message,
      });
    }
    res.status(200).json({ message: "Formation ajoutée à l'utilisateur !" });
  });
});

/* ------------------------------Suppression d'une formation d'un utilisateur----------------------------- */

app.post("/remove-formation-utilisateur", (req, res) => {
  const { userId, idformation } = req.body;
  const sql = `DELETE FROM users_formations WHERE user_id = ? AND formation_id = ?`;
  db.query(sql, [userId, idformation], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la suppression de la formation de l'utilisateur :",
        err
      );
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la suppression de la formation de l'utilisateur.",
        details: err.message,
      });
    }
    res.status(200).json({ message: "Formation supprimée de l'utilisateur !" });
  });
});


/*  ------------------------------Récuperation des formations liées à un utilisateur----------------------------- */

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

/* ------------------------------Ajout d'une formation à la base de données----------------------------- */

app.post("/ajouter-formation", (req, res) => {
  const { nom, ville, adresse, pays } = req.body;
  /* générer un code aléatoire à 6 chiffres */
  const codePartage = Math.floor(100000 + Math.random() * 900000);
  const sql = `INSERT INTO formations (nom, ville, adresse, pays, code_partage) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [nom, ville, adresse, pays, codePartage], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la formation :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de l'ajout de la formation.",
        details: err.message,
      });
    }
    // renvoyer l'ID de la formation
    res.status(200).json({ formation_id: result.insertId, message: "Formation ajoutée avec succès !" });

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

/* ------------------------------Ajout d'une classe à la base de données----------------------------- */

app.post("/ajouter-classe", (req, res) => {
  const { nom, description, idformation } = req.body;
  const sql = `INSERT INTO classes (nom, description, formation_id) VALUES (?, ?, ?)`;
  db.query(sql, [nom, description, idformation], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la classe :", err);
      return res.status(500).json({
        error: true,
        message: "Une erreur s'est produite lors de l'ajout de la classe.",
        details: err.message,
      });
    } else {
      res.status(200).json({ message: "Classe ajoutée avec succès !" });
    }
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

/* ------------------------------Ajout d'un étudiant avec image----------------------------- */

app.post("/upload", (req, res) => {
  const { firstName, lastName, image, classe_id } = req.body;

  // Requête SQL pour insérer un nouvel élève dans la base de données
  const sql = `INSERT INTO eleves (nom, prenom, classe_id, image_base64) VALUES (?, ?, ?, ?)`;
  const values = [lastName, firstName, classe_id, image];

  // Exécution de la requête SQL
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding student: ", err);
      res
        .status(500)
        .json({ error: "An error occurred while adding the student" });
      return;
    }
    console.log("Student added successfully");
    res.status(200).json({ message: "Student added successfully" });
  });
});


/* ------------------------------Vérification du code de partage----------------------------- */

app.post("/verify-share-code", (req, res) => {
  const { shareCode } = req.body;

  // faire une requête SQL pour vérifier si le code de partage existe
  const sql = `SELECT * FROM formations WHERE code_partage = ?`;

  db.query(sql, [shareCode], (err, result) => {
    if (err) {
      console.error("Erreur lors de la vérification du code de partage :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la vérification du code de partage.",
        details: err.message,
      });
    }

    if (result.length > 0) {
      console.log("Formation trouvée avec le code de partage :", result[0]);
      // envoyer l'id de la formation
      res.status(200).json({
        formationId: result[0].formation_id,
      });
    } else {
      res.status(400).json({ message: "Code de partage invalide" });
    }
  });
});



/* ------------------------------Suppression d'un étudiant----------------------------- */

app.post("/etudiants/:idetudiant/delete", (req, res) => {
  const idetudiant = req.params.idetudiant;
  const sql = `DELETE FROM eleves WHERE eleve_id = ?`;
  db.query(sql, [idetudiant], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'étudiant :", err);
      return res.status(500).json({
        error: true,
        message:
          "Une erreur s'est produite lors de la suppression de l'étudiant.",
        details: err.message,
      });
    }
    res.status(200).json({ message: "Étudiant supprimé avec succès !" });
  });
});


