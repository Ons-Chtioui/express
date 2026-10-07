const express = require('express');
const articleRoutes = require('./router/ArticleRouter');
const userRoutes = require('./router/userRoutes'); // 1. Importation du routeur users
const app = express();
const PORT = 3000;

// Middlewares globaux
app.use(express.json()); // indispensable pour lire le corps JSON (req.body)

// Montage du routeur sous le préfixe '/api/articles'
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes); // 2. Montage sous /api/users
// Route d'accueil pour tester le statut général du serveur
app.get('/', (req, res) => {
  res.json({ message: "API du Blog - Serveur Modulaire Opérationnel (SoC)" });
});

app.listen(PORT, () => {
  console.log(`Serveur modulaire en écoute sur http://localhost:${PORT}`);
});