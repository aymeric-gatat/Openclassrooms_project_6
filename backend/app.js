// Import des modules nécessaires
const express = require("express");
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const MONGO_KEY = process.env.MONGODB_KEY;

// Connexion à MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(`${MONGO_KEY}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Gestion des chemins de fichiers
const path = require("path");

// Import des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Configuration des en-têtes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Gestion des fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes pour l'authentification
app.use("/api/auth", userRoutes);

// Routes pour les sauces
app.use("/api/sauces", sauceRoutes);

module.exports = app;
