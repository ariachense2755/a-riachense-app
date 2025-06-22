// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Use a variável de ambiente ou fallback para localhost
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/a_riachense';

const products = [
  { name: "Marlboro XXL 27", description: "Pack XXL 27 cigarros", price: 7.0, img: "img/bolo-arroz.png" },
  { name: "Pão Alentejano", description: "Pão tradicional alentejano", price: 2.0, img: "img/pao-alentejano.png" },
  // Adicione mais produtos...
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado ao MongoDB!');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ Produtos inseridos com sucesso!");
  } catch (error) {
    console.error('❌ Erro ao inserir produtos:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

// Executa
seedDatabase();

