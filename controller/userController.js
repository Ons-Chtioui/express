
const { estNonVide, estEmailValide } = require('../utils/validators');
const users=[
    {id:1,name:"onschtioui",email:"chtiouions1@gmail.com",role:"admin"},
    {id:2,name:"ons",email:"ons@gmail.com",role:"user"}]
let prochainId = 3;
// 1. Récupérer tous les utilisateurs (avec filtre optionnel ?role=...)
const getAllUsers = (req, res) => {
  const { role } = req.query;
  let resultat = users;
  if (role) {
    resultat = users.filter(u => u.role === role);
  }
  res.status(200).json({ total: resultat.length, users: resultat });
};

// 2. Récupérer un utilisateur par son ID
const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `Utilisateur ${id} introuvable` });
  }
  res.status(200).json(user);
};



const createUser = (req, res) => {
  const { name, email, role } = req.body;

  // 1. Validation du nom
  if (!estNonVide(name)) {
    return res.status(400).json({ error: "Le nom est obligatoire et ne doit pas être vide" });
  }

  // 2. Validation de l'email
  if (!estEmailValide(email)) {
    return res.status(400).json({ error: "L'adresse email est invalide (doit contenir '@' et '.')" });
  }

  // 3. Création de l'utilisateur si la validation réussit
  const nouvelUtilisateur = {
    id: prochainId++,
    name: name.trim(),
    email: email.trim(),
    role: role || 'user' // Rôle par défaut
  };

  users.push(nouvelUtilisateur);
  res.status(201).json({ message: 'Utilisateur créé', user: nouvelUtilisateur });
};
// 4. Supprimer un utilisateur
const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const userExiste = users.some(u => u.id === id);
  if (!userExiste) {
    return res.status(404).json({ error: `Impossible de supprimer : utilisateur ${id} introuvable` });
  }
  users = users.filter(u => u.id !== id);
  res.status(200).json({ message: `Utilisateur ${id} supprimé avec succès` });
};

// Exportation des fonctions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};