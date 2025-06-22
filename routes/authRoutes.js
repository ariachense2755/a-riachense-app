const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.SECRET_KEY || 'SECRET_KEY_AQUI';

// Registrar novo usuário (admin)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: "Username já existe" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    res.json({ message: "Admin registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor ao registrar" });
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Password incorreta" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor ao fazer login" });
  }
});

// Middleware para autenticar token JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token mal formatado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = { router, authMiddleware };

