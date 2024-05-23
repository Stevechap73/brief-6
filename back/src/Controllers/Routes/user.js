const express = require("express");
const {
  addRegisterPicture,
  register,
  valideAccount,
  emailForgotPassword,
  ForgotPassword,
  login,
  testEmail,
} = require("../userController");

// Importer les middlewares
const { verifRegister } = require("../../Middlewares/middlewares");

const router = express.Router();

// Ajout d'une image
router.post("/add/picture", addRegisterPicture);

// Ajout d'un user
router.post("/register", verifRegister, register);

// Activation compte
router.get("/activate/:token", valideAccount);

// Génération d'un mail pour la réinitialisation du mot de passe
router.post("/emailForgotPassword", emailForgotPassword);

// Création du nouveau mot de passe
router.patch("/forgotPassword", ForgotPassword);

// Login
router.post("/login", login);

// pour l'envoie de mail
router.get("/email", testEmail);

module.exports = router;
