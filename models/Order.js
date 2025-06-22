const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  customer: {
    name: String,
    address: String,
    paymentMethod: String,
    deliveryMethod: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

