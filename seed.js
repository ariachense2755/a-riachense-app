// seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Garanta que o modelo existe

mongoose.connect('mongodb://localhost:27017/a-riachense', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB conectado para seed!');
})
.catch(error => {
  console.error(error);
});

const products = [
  { name: "Marlboro XXL 27", description: "Pack XXL 27 cigarros", price: 7, img: "img/bolo-arroz.png" },
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

