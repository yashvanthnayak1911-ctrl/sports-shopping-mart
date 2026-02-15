const jwt = require('jsonwebtoken');

const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: 'Token verification failed, access denied' });
        }

        const user = await User.findById(verified.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found, access denied' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const adminAuth = async (req, res, next) => {
    await auth(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
    });
};

module.exports = { auth, adminAuth };
