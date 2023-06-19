const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); // Middleware d'authentification
const userCtrl = require("../controllers/user"); // Contrôleur des routes utilisateur

// Route pour l'inscription d'un nouvel utilisateur
router.post("/signup", userCtrl.signup);

// Route pour la connexion d'un utilisateur
router.post("/login", userCtrl.login);

module.exports = router;
