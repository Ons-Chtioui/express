const User = require('../models/userModel');
const Article = require('../models/articleModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Token JWT
const generateToken = (id,role) => {
  return jwt.sign({ id,role}, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};
//POST /api/users/register
const registerUser = async (req, res) => {
  try {
  const { name, email, password, age, role, bio, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'L\'utilisateur existe déjà avec cet email' });
  }
  // Hash du mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name, 
email,
    password: hashedPassword,
    age,
    role: role || 'user', // Par défaut, le rôle est
    bio,
    phone
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      bio: user.bio,
      phone: user.phone,
      token: generateToken(user._id, user.role)
    });
  }
  } catch (err) {
    if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
  }res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// POST /api/users/login (Connexion)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Comparaison sécurisée en temps constant
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/profile (Profil protégé)
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password'); // Exclure le mot de passe
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

// PUT /api/users/update-password (Protégé)
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'L ancien et le nouveau mot de passe sont requis' });
    }

    // req.user est disponible grâce au middleware protect
    const user = await User.findById(req.user._id);

    // 1. Vérification de l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    // 2. Attribution du nouveau mot de passe 
    // (Note : si vous avez un hook pre('save') dans votre Schema Mongoose qui hache le mot de passe, 
    // assignez simplement user.password = newPassword. Sinon, hachez-le manuellement comme ci-dessous)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PUT /api/users/:id/role (Admin seulement)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: `Rôle mis à jour avec succès: ${user.role}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser , loginUser , getUserProfile,updatePassword,updateUserRole
};