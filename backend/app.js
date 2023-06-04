const express = require("express");
const app = express();

// Connection à mongodb
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://aymeric:9s1DyZ4Nd58BslEU@cluster0.lptvli3.mongodb.net/?retryWrites=true&w=majority", //faire un .env dans les ressources du guide
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Routers
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
// Authentification
app.use("/api/auth", userRoutes);

// Sauces
app.use("/api", sauceRoutes);

//App
app.use((req, res, next) => {
  res.json({ message: req.body });
});

module.exports = app;
