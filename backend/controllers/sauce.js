const { error } = require("console");
const Sauce = require("../models/Sauce");
const fs = require("fs");
const { parse } = require("path");
//  Post

exports.postSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

// Get

exports.getSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//Put

exports.putSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body };

      if (req.file && sauce.imageUrl) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }

      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié!" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Delete

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
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

// Get All
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Post Like & Dislike

exports.likeSauce = (req, res, next) => {
  const { userId, like } = req.body;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }

      const userIndex = sauce.usersLiked.indexOf(userId);
      const likeIndex = sauce.usersDisliked.indexOf(userId);

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

      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;

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
