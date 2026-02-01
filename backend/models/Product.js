const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
