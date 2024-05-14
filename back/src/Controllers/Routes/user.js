const express = require("express");
const { register, login, testEmail } = require("../userController");

// importer les middlewares
const { verifRegister } = require("../../Middlewares/middlewares");

const router = express.Router();

// ajout d'un user
router.post("/register", verifRegister, register);

// Login
router.post("/login", login);

// pour l'envoie de mail
router.get("/email", testEmail);

module.exports = router;
