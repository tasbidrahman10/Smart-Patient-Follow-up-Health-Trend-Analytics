const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.post('/logout', verifyToken, authController.logout);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;