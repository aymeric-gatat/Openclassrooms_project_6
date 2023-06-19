const jwt = require("jsonwebtoken");

// Configuration de l'accès au fichier .env
const dotenv = require("dotenv");
dotenv.config();
const TOKEN = process.env.TOKEN;

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupération du token d'authentification du header
    const decodedToken = jwt.verify(token, TOKEN); // Vérification et décodage du token à l'aide de la clé secrète
    const userId = decodedToken.userId; // Récupération de l'ID de l'utilisateur à partir du token décodé
    req.auth = {
      userId: userId, // Ajout de l'ID de l'utilisateur à l'objet "auth" attaché à l'objet de requête (req)
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
