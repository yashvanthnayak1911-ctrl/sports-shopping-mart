const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');

// Add new product (admin)
router.post('/products/add', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Convert to proper types
    const productData = {
      name: String(name).trim(),
      description: String(description).trim(),
      price: parseFloat(price),
      category: String(category).trim(),
      image: image && String(image).trim() !== '' ? String(image).trim() : null,
      stock: parseInt(stock)
    };

    // Validate numbers
    if (isNaN(productData.price) || productData.price <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }

    if (isNaN(productData.stock) || productData.stock < 0) {
      return res.status(400).json({ message: 'Stock must be a valid non-negative number' });
    }

    console.log('Creating product with data:', productData);

    const product = new Product(productData);
    await product.save();

    console.log('Product saved:', product);
    res.json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: err.message || 'Error adding product' });
  }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
