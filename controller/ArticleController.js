const Article = require('../models/articleModel');

// 1. GET /api/articles (Récupérer tous les articles)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name email role');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. GET /api/articles/:id (Récupérer un article unique)
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email role');

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(article);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 3. POST /api/articles (Création protégée)
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Titre et contenu obligatoires' });
    }

    // L'auteur est extrait directement du token JWT vérifié (req.user)
    const newArticle = await Article.create({
      title,
      content,
      author: req.user._id
    });

    const populated = await newArticle.populate('author', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. PUT /api/articles/:id (Modification protégée : auteur ou admin)
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Vérification des droits de propriété
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article"
      });
    }

    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;

    const updated = await article.save();
    const populated = await updated.populate('author', 'name email role');
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 5. DELETE /api/articles/:id (Suppression protégée : auteur ou admin)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Vérification des droits de propriété
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article"
      });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Article supprimé avec succès', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};
// GET /api/articles/my-articles (Protégé)
const getMyArticles = async (req, res) => {
  try {
    // Récupération des articles appartenant uniquement à l'utilisateur connecté
    const articles = await Article.find({ author: req.user._id }).populate('author', 'name email role');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles
};