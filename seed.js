// seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Garanta que o modelo existe

mongoose.connect('mongodb://127.0.0.1:27017/a_riachense')
  .then(() => {
    console.log('✅ Conectado ao MongoDB!');
    // aqui roda seu seed
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao MongoDB', error);
  });
const products = [
  { name: "Marlboro XXL 27", description: "Pack XXL 27 cigarros", price: 7.0, img: "img/bolo-arroz.png" },
  { name: "Pão Alentejano", description: "Pão tradicional alentejano", price: 2.0, img: "img/pao-alentejano.png" },
  // Adicione mais produtos...
];

async function seedDatabase() {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ Produtos inseridos com sucesso!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();

