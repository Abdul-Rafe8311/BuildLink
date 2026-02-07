const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

// Public routes
router.get('/builders', userController.getBuilders);
router.get('/builders/:id', userController.getBuilderById);

module.exports = router;
