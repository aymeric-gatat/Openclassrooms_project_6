const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); // Middleware d'authentification
const multer = require("../middleware/multer-config"); // Middleware de gestion des fichiers
const sauceCtrl = require("../controllers/sauce"); // Contrôleur des routes de sauces

// Route pour récupérer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);

// Route pour créer une nouvelle sauce
router.post("/", auth, multer, sauceCtrl.postSauce);

// Route pour gérer les likes/dislikes d'une sauce
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// Route pour récupérer une sauce spécifique
router.get("/:id", auth, sauceCtrl.getSauce);

// Route pour mettre à jour une sauce
router.put("/:id", auth, multer, sauceCtrl.putSauce);

// Route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
