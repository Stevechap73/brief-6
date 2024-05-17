const { pool } = require("../Connections/sqlConnection");
const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const uploadDirectory = path.join(__dirname, "../Public/uploads");
const { transporter } = require("../Utils/mailer"); // pour l'envoie de mail
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");

// Insertion d'une image dans le register
const addRegisterPicture = async (req, res) => {
  let newFileName;
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      newFileName = `${file.fieldname}-${Date.now()}.jpg`;
      cb(null, newFileName);
    },
  });

  const maxSize = 3 * 1000 * 1000;

  let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      let filetypes = /jpeg|jpg|png/;
      let mimetype = filetypes.test(file.mimetype);

      let extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Erreur: Le téléchargement de fichiers ne prend en charge que " +
          "les types de fichiers suivants - " +
          filetypes
      );
    },
  }).single("image");

  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ newFileName: newFileName });
    }
  });
};

// Ajout d'un user une fois que le middleware est validé avec envoie de mail
const register = async (req, res) => {
  try {
    const email = req.email;
    const values = [email];
    const sql = `SELECT email FROM user WHERE email =  ?`;
    const [result] = await pool.execute(sql, values);
    if (result.length !== 0) {
      res.status(400).json({ error: "Mail déjà dans la base" });
      return;
    } else {
      const password = req.password;
      // const role_id = req.role_id;
      const user_name = req.user_name;
      const picture_user = req.body.picture_user;
      const hash = await bcrypt.hash(password, 10);
      const sqlInsertRequest =
        "INSERT INTO user (email, password, role_id, user_name, picture_user, token, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";

      const tokenBasis = email + `${new Date()}`;
      const activationToken = await bcrypt.hash(tokenBasis, 10);
      let cleanToken = activationToken.replaceAll("/", "");

      const insertValues = [
        email,
        hash,
        1,
        user_name,
        picture_user,
        cleanToken,
        2,
      ];
      const [rows] = await pool.execute(sqlInsertRequest, insertValues);
      if (rows.affectedRows > 0) {
        const info = await transporter.sendMail({
          from: `${process.env.SMTP_EMAIL}`,
          to: "steve.chapuis4@free.fr",
          subject: "Email d'activation ✔",
          text: "Activer votre compte",
          html: `<p> You need to activate your email, to access our services, please click on this link :
                <a href="http://localhost:3003/user/activate/${cleanToken}">Activate your email</a>
          </p>`,
        });

        res.status(201).json({ success: "inscription réussi" });
        return;
      } else {
        res.status(500).json({ error: "L'nscription a échoué" });
        return;
      }
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Erreur du serveur" });
    return;
  }
};

// Activation de compte
const valideAccount = async (req, res) => {
  try {
    // On récupère le token présent dans le lien de l'email.
    const token = req.params.token;
    // On recherche l'utilisateur qui aurait ce token, que nous avions insérer lors
    // de la création
    const sql = `SELECT * FROM user WHERE token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);
    if (!result) {
      res.status(204).json({ error: "Wrong credentials" });
      return;
    }
    // Si l'utilisateur ayant ce token existe, alors j'active le compte ,
    // et supprime le token car il ne me sera plus utile pour le moment
    await pool.execute(
      `UPDATE user SET is_active = 1, token = NULL WHERE token = ?`,
      [token]
    );
    return res.status(200).json({ result: "Account activated" });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

// // Ajout d'un user une fois que le middleware est validé sans l'envoie de mail attention enlevé la colonne token dans la base de données pour utiliser ce controller
// const register = async (req, res) => {
//   try {
//     const email = req.email;
//     const values = [email];
//     const sql = `SELECT email FROM user WHERE email =  ?`;
//     const [result] = await pool.execute(sql, values);
//     if (result.length !== 0) {
//       res.status(400).json({ error: "Mail déjà dans la base" });
//       return;
//     } else {
//       const password = req.password;
//       const role_id = req.role_id;
//       const user_name = req.user_name;
//       const picture_user = req.body.picture_user;
//       const hash = await bcrypt.hash(password, 10);
//       const sqlInsertRequest =
//         "INSERT INTO user (email, password, role_id, user_name, picture_user) VALUES (?, ?, ?, ?, ?)";
//       // const activationToken = await bcrypt.hash(email, 10);

//       const insertValues = [email, hash, role_id, user_name, picture_user];
//       const [rows] = await pool.execute(sqlInsertRequest, insertValues);
//       if (rows.affectedRows > 0) {
//         res.status(201).json({ success: "inscription réussi" });
//         return;
//       } else {
//         res.status(500).json({ error: "L'nscription a échoué" });
//         return;
//       }
//     }
//   } catch (error) {
//     console.log(error.stack);
//     res.status(500).json({ error: "Erreur du serveur" });
//     return;
//   }
// };

// Connexion sur un compte existant

const login = async (req, res) => {
  if (!req.body.identifier || !req.body.password) {
    res.status(400).json({ error: "Champs manquants" });
    return;
  }
  let identifier = req.body.identifier;
  let password = req.body.password;
  try {
    const values = [identifier, identifier];
    const sql = `SELECT * FROM user WHERE email = ? OR user_name = ?`;
    const [result] = await pool.execute(sql, values);
    // console.log(result);
    if (result.length === 0) {
      res.status(401).json({ error: "Identifiants invalides" });
      return;
    } else {
      if (result[0].is_active === 2) {
        res.status(401).json({
          error:
            "Votre compte n'est pas activé. Veuillez activer votre compte avec l'email d'activation",
        });
        return;
      }
      await bcrypt.compare(
        password,
        result[0].password,
        function (err, bcyrptresult) {
          if (err) {
            res.status(401).json({ error: "Identifiants invalides" });
            return;
          }

          const token = jwt.sign(
            {
              email: result[0].email,
              id: result[0].id,
              role_id: result[0].role_id,
              user_name: result[0].user_name,
              picture_user: result[0].picture_user,
            },
            process.env.SECRET_KEY,
            { expiresIn: "20d" }
          );
          console.log();
          res.status(200).json({ jwt: token, role_id: result[0].role_id });
          return;
        }
      );
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const testEmail = async (req, res) => {
  const info = await transporter.sendMail({
    from: `${process.env.SMTP_EMAIL}`,
    to: "steve.chapuis4@free.fr",
    subject: "Bonjour ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).json(`Message send with the id ${info.messageId}`);
};

module.exports = {
  addRegisterPicture,
  register,
  valideAccount,
  login,
  testEmail,
};
