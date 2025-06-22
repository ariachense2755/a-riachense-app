const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: Number,
  img: String,
  description: String
});

module.exports = mongoose.model('Product', ProductSchema);

