const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const order = new Order({
      userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
