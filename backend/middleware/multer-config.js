const multer = require("multer");

// Types de fichiers MIME autorisés avec leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Répertoire de destination des fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Nom du fichier sans espaces
    const extension = MIME_TYPES[file.mimetype]; // Extension du fichier basée sur le type MIME
    callback(null, name + Date.now() + "." + extension); // Nom du fichier complet avec horodatage pour éviter les doublons
  },
});

// Filtrage des fichiers à uploader
const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"]; // Types MIME autorisés
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // Accepter le fichier
  } else {
    callback(new Error("Invalid file type")); // Rejeter le fichier avec un type MIME invalide
  }
};

// Exportation du middleware Multer configuré avec le stockage et le filtrage des fichiers
module.exports = multer({ storage: storage, fileFilter: fileFilter }).single("image");
