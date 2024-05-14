const express = require("express");
const {
  addRegisterPicture,
  register,
  login,
  testEmail,
} = require("../userController");

// importer les middlewares
const { verifRegister } = require("../../Middlewares/middlewares");

const router = express.Router();

// ajout d'une image
router.post("/add/picture", addRegisterPicture);

// ajout d'un user
router.post("/register", verifRegister, register);

// Login
router.post("/login", login);

// pour l'envoie de mail
router.get("/email", testEmail);

module.exports = router;
