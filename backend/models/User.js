// Importation des modules
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création du shéma MongoDB d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Application du plugin uniqueValidator au schéma pour la validation des champs uniques
userSchema.plugin(uniqueValidator);

// Exportation du modèle "User" basé sur le schéma userSchema
module.exports = mongoose.model("User", userSchema);
