const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");
const UserService = require("../services/UserService");

const authMiddleware = async (req, res, next) => {
  console.log("Headers reçus :", req.headers); 

  const authHeader = req.headers.authorization;
  console.log("Header Authorization :", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Accès non autorisé, token manquant", 401));
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extrait :", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded); 

    const user = await UserService.getUserById(decoded.id);
    if (!user) {
      return next(new AppError("Utilisateur non trouvé", 404));
    }

    req.user = user; 
    console.log("Utilisateur attaché à req :", req.user); 
    next();
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    next(new AppError("Token invalide", 401));
  }
};

module.exports = authMiddleware;
