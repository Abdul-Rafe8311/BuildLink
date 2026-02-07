const express = require('express');
const router = express.Router();
const plotController = require('../controllers/plotController');
const { authenticate } = require('../middleware/auth');

// All plot routes require authentication
router.use(authenticate);

router.get('/', plotController.getPlots);
router.post('/', plotController.createPlot);
router.get('/:id', plotController.getPlot);
router.put('/:id', plotController.updatePlot);
router.delete('/:id', plotController.deletePlot);

module.exports = router;
