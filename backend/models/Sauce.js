const mongoose = require("mongoose");

// Shema de "Sauce"
const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String },
  imageUrl: { type: String },
  heat: { type: Number, min: 1, max: 10 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: String, ref: "Utilisateur" }],
  usersDisliked: [{ type: String, ref: "Utilisateur" }],
});

module.exports = mongoose.model("Sauce", sauceSchema);
