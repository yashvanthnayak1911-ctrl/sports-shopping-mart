const express = require('express');
const router = express.Router();

// Get cart
router.get('/', (req, res) => {
  res.json({ message: 'Cart endpoint' });
});

// Add to cart
router.post('/add', (req, res) => {
  res.json({ message: 'Item added to cart' });
});

// Remove from cart
router.delete('/remove/:itemId', (req, res) => {
  res.json({ message: 'Item removed from cart' });
});

module.exports = router;
