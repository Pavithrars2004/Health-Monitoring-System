// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const users = []; // In-memory storage for users
const healthData = []; // In-memory storage for health data

const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Get health data (protected route)
app.get('/api/health', authenticateJWT, (req, res) => {
  res.json(healthData.filter(entry => entry.username === req.user.username));
});

// Add new health data (protected route)
app.post('/api/health', authenticateJWT, (req, res) => {
  const newEntry = { ...req.body, username: req.user.username };
  healthData.push(newEntry);
  res.status(201).json(newEntry);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
