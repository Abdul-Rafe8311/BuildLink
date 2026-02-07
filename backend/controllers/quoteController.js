const QuoteRequest = require('../models/QuoteRequest');
const Quote = require('../models/Quote');

/**
 * Create quote request
 * POST /api/quotes/requests
 */
exports.createQuoteRequest = async (req, res, next) => {
    try {
        const quoteRequest = await QuoteRequest.create({
            ...req.body,
            customer: req.user._id
        });

        await quoteRequest.populate('plot');

        res.status(201).json({
            success: true,
            message: 'Quote request created successfully',
            data: {
                quoteRequest
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get quote requests
 * GET /api/quotes/requests
 */
exports.getQuoteRequests = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = { customer: req.user._id };

        if (status) {
            query.status = status;
        }

        const quoteRequests = await QuoteRequest.find(query)
            .populate('plot')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                quoteRequests
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get single quote request
 * GET /api/quotes/requests/:id
 */
exports.getQuoteRequest = async (req, res, next) => {
    try {
        const quoteRequest = await QuoteRequest.findById(req.params.id)
            .populate('plot');

        if (!quoteRequest) {
            return res.status(404).json({
                success: false,
                message: 'Quote request not found'
            });
        }

        // Check authorization
        if (quoteRequest.customer.toString() !== req.user._id.toString() && req.user.role !== 'builder') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                quoteRequest
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Submit quote (builder only)
 * POST /api/quotes
 */
exports.submitQuote = async (req, res, next) => {
    try {
        // Verify builder role
        if (req.user.role !== 'builder') {
            return res.status(403).json({
                success: false,
                message: 'Only builders can submit quotes'
            });
        }

        const quote = await Quote.create({
            ...req.body,
            builder: req.user._id
        });

        // Update quote request
        await QuoteRequest.findByIdAndUpdate(req.body.quoteRequest, {
            $inc: { quotesReceived: 1 },
            status: 'active'
        });

        await quote.populate(['quoteRequest', 'builder']);

        res.status(201).json({
            success: true,
            message: 'Quote submitted successfully',
            data: {
                quote
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get quotes
 * GET /api/quotes
 */
exports.getQuotes = async (req, res, next) => {
    try {
        let query = {};

        if (req.user.role === 'builder') {
            query.builder = req.user._id;
        } else {
            // Get quotes for user's quote requests
            const userQuoteRequests = await QuoteRequest.find({ customer: req.user._id }).select('_id');
            query.quoteRequest = { $in: userQuoteRequests.map(qr => qr._id) };
        }

        const quotes = await Quote.find(query)
            .populate('quoteRequest')
            .populate('builder', '-password -refreshToken')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                quotes
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Accept quote
 * PUT /api/quotes/:id/accept
 */
exports.acceptQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findById(req.params.id).populate('quoteRequest');

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        // Verify ownership
        if (quote.quoteRequest.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        quote.status = 'accepted';
        quote.acceptedAt = new Date();
        quote.customerNotes = req.body.notes;
        await quote.save();

        // Update quote request
        await QuoteRequest.findByIdAndUpdate(quote.quoteRequest._id, {
            status: 'completed'
        });

        res.json({
            success: true,
            message: 'Quote accepted successfully',
            data: {
                quote
            }
        });

    } catch (error) {
        next(error);
    }
};
