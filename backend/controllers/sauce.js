// Import des modules nécessaires
const { error } = require("console");
const Sauce = require("../models/Sauce");
const fs = require("fs");
const { parse } = require("path");

// Fonction pour ajouter une sauce
exports.postSauce = (req, res, next) => {
  // Extraction des données de la requête
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppression des identifiants indésirables
  delete sauceObject._id;
  delete sauceObject._userId;

  // Création d'une instance du modèle Sauce avec les données de la requête
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour récupérer une sauce
exports.getSauce = (req, res, next) => {
  // Recherche d'une sauce avec l'ID spécifié
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour mettre à jour une sauce
exports.putSauce = (req, res, next) => {
  // Recherche d'une sauce avec l'ID spécifié
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification de l'autorisation de modification
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Préparation des données de la sauce à mettre à jour
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body };

      // Suppression de l'ancienne image si une nouvelle image est téléchargée
      if (req.file && sauce.imageUrl) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }

      // Mise à jour de la sauce dans la base de données
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié!" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // Recherche d'une sauce avec l'ID spécifié
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification de l'autorisation de suppression
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Suppression de l'image associée à la sauce
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Suppression de la sauce de la base de données
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // Recherche de toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour aimer ou ne pas aimer une sauce
exports.likeSauce = (req, res, next) => {
  // Récupération des données de la requête
  const { userId, like } = req.body;

  // Recherche de la sauce avec l'ID spécifié
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérification si la sauce existe
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }

      // Recherche de l'indice de l'utilisateur dans les tableaux des utilisateurs qui ont aimé ou n'ont pas aimé la sauce
      const userIndex = sauce.usersLiked.indexOf(userId);
      const likeIndex = sauce.usersDisliked.indexOf(userId);

      // Mise à jour des tableaux en fonction de la valeur "like" de la requête
      if (like === 1) {
        if (userIndex === -1) {
          sauce.usersLiked.push(userId);
        }
        if (likeIndex !== -1) {
          sauce.usersDisliked.splice(likeIndex, 1);
        }
      } else if (like === -1) {
        if (userIndex === -1) {
          sauce.usersDisliked.push(userId);
        }
        if (likeIndex !== -1) {
          sauce.usersLiked.splice(userIndex, 1);
        }
      } else if (like === 0) {
        if (userIndex !== -1) {
          sauce.usersLiked.splice(userIndex, 1);
        }
        if (likeIndex !== -1) {
          sauce.usersDisliked.splice(likeIndex, 1);
        }
      } else {
        return res.status(400).json({ message: "Invalid like value" });
      }

      // Mise à jour du nombre de likes et dislikes de la sauce
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;

      // Sauvegarde de la sauce mise à jour dans la base de données
      sauce
        .save()
        .then(() => {
          res.status(200).json({ message: "Like status updated successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
