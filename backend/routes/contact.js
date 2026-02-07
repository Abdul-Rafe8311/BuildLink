const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation middleware
const contactValidation = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('userType').isIn(['customer', 'builder', 'other']).withMessage('Invalid user type'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

// Routes
router.post('/', contactValidation, contactController.submitMessage);
router.get('/', contactController.getAllMessages); // For admin use

module.exports = router;
