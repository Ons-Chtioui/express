const express = require('express');
const articleRoutes = require('./router/ArticleRouter');
const userRoutes = require('./router/userRoutes'); // 1. Importation du routeur users
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
const app = express();
const PORT =process.env.PORT|| 3000;

// Middlewares globaux
app.use(express.json()); // indispensable pour lire le corps JSON (req.body)

// Montage du routeur sous le préfixe '/api/articles'
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes); // 2. Montage sous /api/users
// Route d'accueil pour tester le statut général du serveur
app.get('/', (req, res) => {
  res.json({ message: "API du Blog - Serveur Modulaire Opérationnel (SoC)" });
});

//Connexion asynchrone au base 
(async () => {  
  try {
    await connectDB(process.env.MONGODB_URI);


app.listen(PORT, () => {
  console.log(`Serveur modulaire en écoute sur http://localhost:${PORT}`);
});}
catch (err) {
  console.error("Erreur de connexion à la base de données :", err.message);
  process.exit(1); // Arrêt du serveur en cas d'erreur de connexion
}
  })();