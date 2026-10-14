const User = require('../models/userModel');
const Article = require('../models/articleModel');

// Obtenir tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.status(200).json({ total: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un utilisateur par son ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Identifiant de ressource invalide (format ObjectId attendu)'
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { name, email, age, role, bio, phone } = req.body;
    const user = await User.create({ name, email, age, role, bio, phone });
    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Identifiant de ressource invalide (format ObjectId attendu)'
      });
    }
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const hasArticles = await Article.findOne({ author: userId });
    if (hasArticles) {
      return res.status(400).json({
        message: 'Impossible de supprimer un utilisateur ayant des articles publies'
      });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès', id: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Identifiant de ressource invalide (format ObjectId attendu)'
      });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};