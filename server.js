// Importa as dependências
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializa o app
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

// Simula base de dados
let products = [
  { id: 1, category: 'Tabaco', name: 'Cigarros XXX', price: 5.5, description: 'Descrição do produto' },
  { id: 2, category: 'Papelaria', name: 'Caderno A4', price: 2.0, description: 'Descrição do produto' },
  { id: 3, category: 'Jornais', name: 'Último Jornal', price: 1.5, description: 'Descrição do produto' }
];
let orders = [];

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Rota para finalizar pedido
app.post('/api/orders', (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).send({ error: 'Pedido inválido' });
  }

  const order = {
    id: orders.length + 1,
    customer,
    items,
    date: new Date()
  };
  orders.push(order);

  res.json({ success: true, orderId: order.id });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
