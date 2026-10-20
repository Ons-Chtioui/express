const express = require('express');
const router = express.Router();
const articleController = require('../controller/ArticleController');
const{
    getAllArticles,getArticleById,createArticle,updateArticle,deleteArticle,getMyArticles} = require('../controller/ArticleController');
const { protect } = require('../middlewares/authMiddleware');

// Remarque capitale : Le préfixe '/api/articles' sera défini dans server.js.
// Ici, '/' représente donc la racine de la ressource : '/api/articles' !
router.get('/', getAllArticles);
router.get('/my-articles', protect, getMyArticles);
router.get('/:id', getArticleById);
//proteger les routes de création, mise à jour et suppression d'articles
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);
module.exports = router;