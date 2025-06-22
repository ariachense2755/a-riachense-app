const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // armazenado com hash
  role: { type: String, default: 'admin' } // Ex: admin
});

module.exports = mongoose.model('User', UserSchema);

const bcrypt = require('bcrypt');

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();

  res.json({ message: "Admin registrado com sucesso" });
});

const jwt = require('jsonwebtoken');

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ error: "Utilizador não encontrado" });
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).send({ error: "Password incorreta" });

  const token = jwt.sign({ userId: user._id, role: user.role }, "SECRET_KEY_AQUI", { expiresIn: "1h" });
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "SECRET_KEY_AQUI");
    req.user = decoded;
    next();
  } catch {
    res.status(403).send({ error: "Token inválido" });
  }
}

app.put("/api/products/:id", authMiddleware, async (req, res) => {
  // mesma lógica, mas protegido
});

app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  // mesma lógica, mas protegido
});

