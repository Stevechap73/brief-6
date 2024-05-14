const { pool } = require("../Connections/sqlConnection");
const { transporter } = require("../Utils/mailer"); // pour l'envoie de mail
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

// Ajout d'un user une fois que le middleware est validé
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
      const role_id = req.role_id;
      const user_name = req.user_name;
      const hash = await bcrypt.hash(password, 10);
      const sqlInsertRequest =
        "INSERT INTO user (email, password, role_id, user_name) VALUES (?, ?, ?, ?)";
      // const activationToken = await bcrypt.hash(email, 10);

      const insertValues = [email, hash, role_id, user_name];
      const [rows] = await pool.execute(sqlInsertRequest, insertValues);
      if (rows.affectedRows > 0) {
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

const login = async (req, res) => {
  if (!req.body.identifier || !req.body.password) {
    res.status(400).json({ error: "missing fields" });
    return;
  }
  let identifier = req.body.identifier;
  let password = req.body.password;
  try {
    const values = [identifier, identifier];
    const sql = `SELECT * FROM user WHERE email = ? OR firstName = ?`;
    const [result] = await pool.execute(sql, values);

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    } else {
      await bcrypt.compare(
        password,
        result[0].password,
        function (err, bcyrptresult) {
          if (err) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
          }

          const token = jwt.sign(
            {
              email: result[0].email,
              id: result[0].id,
              role: result[0].role,
              firstName: result[0].firstName,
              adress: result[0].adress,
            },
            process.env.SECRET_KEY,
            { expiresIn: "20d" }
          );
          console.log();
          res.status(200).json({ jwt: token, role: result[0].role });
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
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).json(`Message send with the id ${info.messageId}`);
};

module.exports = { register, login, testEmail };
