const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extraction du token
      token = req.headers.authorization.split(' ')[1];

      // 2. Vérification avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Récupération de l'utilisateur (prend en compte decoded.id ou decoded._id)
      const userId = decoded.id || decoded._id;
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      return next();
    } catch (err) {
      //  Exercice 3 : Gestion explicite de l'expiration du jeton
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Votre session a expire , veuillez vous reconnecter' 
        });
      }

      // Autre erreur de vérification (ex: token corrompu/invalide)
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  }

  return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé, rôle administrateur requis' });
};

module.exports = { protect, adminOnly };