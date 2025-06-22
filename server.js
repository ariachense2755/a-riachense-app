const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const { router: authRouter, authMiddleware } = require('./routes/authRoutes');
dotenv.config();

const Product = require("./models/Product");
const Order = require("./models/Order");

// Verificação de variável de ambiente
if (!process.env.MONGO_URL) {
  console.error("❌ Variável de ambiente MONGO_URL não definida!");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rotas de autenticação
app.use('/api/auth', authRouter);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Conectado ao MongoDB Atlas!"))
  .catch((err) => {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  });

// Rotas para Produtos
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Rotas protegidas para editar e deletar produto
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar produto' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto apagado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar produto' });
  }
});

// Rota para Pedidos
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: "✅ Pedido salvo com sucesso!", orderId: order._id });
  } catch (error) {
    res.status(500).send({ error: "❌ Erro ao salvar o pedido." });
  }
});

// Página inicial (fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
