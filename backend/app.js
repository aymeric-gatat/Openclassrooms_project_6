const express = require("express");
const app = express();
app.use(express.json());
// .env
const dotenv = require("dotenv");
dotenv.config();
const MONGO_KEY = process.env.MONGODB_KEY;

// Connection à mongodb
const mongoose = require("mongoose");
mongoose
  .connect(`${MONGO_KEY}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// path
const path = require("path");

//Routers
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const { error } = require("console");

// Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Path
app.use("/images", express.static(path.join(__dirname, "images")));
// Signup & Login
app.use("/api/auth", userRoutes);
// Sauces
app.use("/api/sauces", sauceRoutes);

module.exports = app;

