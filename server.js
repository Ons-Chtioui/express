const express = require('express');
const app = express();
const port = 3000;
// app.get('/', (req, res) => {
//     res.json({ message: 'Hello, World!' });
// });
app.get('/', (req, res) => {    
    res.send(`<h1>Welcome to the Blog API</h1>`)
});
const articles = [
{ id: 1 , title : "Welcome to the blog ", author : "Admin" } ,
{ id: 2 , title : "My first Express server", author : "Ons" } ,
{ id: 3 , title : "Testing an API with Postman ", author : "Ons" }
];
// GET /api/articles -> all articles
// GET /api/articles?author=ons -> articles filtered by author

app.get("/api/articles", (req , res) => {
 const { author } = req.query; // equivalent to: const author = req.query.author;
  let result = articles;
  
  if (author) { // if query parameter ?author= was provided
    result = articles.filter(a => a.author === author);
  }
  
  res.json({ total: result.length, articles: result });
});

// GET /api/articles/2 -> fetch article whose id equals 2
app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id); // convert "2" (string) -> 2 (number)
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    return res.status(404).json({ error: `Article ${id} not found` });
  }
  res.json(article);
});


app.use(express.json()); 
let nextId = articles.length + 1; // next article id to be assigned
app.post('/api/articles', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    const newArticle = { id: nextId, title:title, author :author };
    nextId++;
    articles.push(newArticle);
    res.status(201).json({message: 'Article created successfully', article: newArticle});
});

//Exercice1

//Question 1 : GET /about
const users = [
  { id: 1, name: "onschtioui", email: "onschtioui@example.com" },
  { id: 2, name: "Ons", email: "ons@example.com" },
  { id: 3, name: "onss", email: "onss@example.com" }
];
app.get('/about', (req, res) => {
  res.json({
    appName: "My First Express Server",
    studentName: "Ons Chtioui", 
    releaseVersion: "1.0.0"
  });
});

//Question 2 et 5 : GET /api/users avec support du filtre ?name=
app.get('/api/users', (req, res) => {
  const { name } = req.query;
  let result = users;

  if (name) {
    result = users.filter(
      u => u.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  }

  res.json(result);
});

// Question 3 : GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User ${id} not found` });
  }

  res.json(user);
});

// Question 4 : POST /contact
app.post('/contact', (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  res.status(200).json({ message: "Thank you, your message has been received" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

