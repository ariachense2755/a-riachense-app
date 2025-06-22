const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 👈 Já declarado aqui
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Modelos
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
const uri = process.env.MONGO_URL || 'mongodb+srv://mongodb+srv://ariachense2755:<db_password>@cluster0.nt0yodu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado ao MongoDB Atlas!');
})
.catch((err) => {
  console.error('❌ Erro ao conectar ao MongoDB', err);
});

// Edita produto
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).send({ error: "Produto não encontrado" });
    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send({ error: "Erro ao editar produto" });
  }
});

// Deleta produto
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send({ error: "Produto não encontrado" });
    res.send({ message: "Produto apagado com sucesso" });
  } catch (error) {
    res.status(500).send({ error: "Erro ao apagar produto" });
  }
});

// Lista produtos
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Salva pedido
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: '✅ Pedido salvo com sucesso!', orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: '❌ Erro ao salvar o pedido.' });
  }
});

// Página inicial
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
