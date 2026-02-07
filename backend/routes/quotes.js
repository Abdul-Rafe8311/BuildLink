const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticate } = require('../middleware/auth');

// All quote routes require authentication
router.use(authenticate);

// Quote requests
router.post('/requests', quoteController.createQuoteRequest);
router.get('/requests', quoteController.getQuoteRequests);
router.get('/requests/:id', quoteController.getQuoteRequest);

// Quotes
router.post('/', quoteController.submitQuote);
router.get('/', quoteController.getQuotes);
router.put('/:id/accept', quoteController.acceptQuote);

module.exports = router;
