const QuoteRequest = require('../models/QuoteRequest');
const Quote        = require('../models/Quote');
const mongoose     = require('mongoose');

// Inline Project schema (only used here)
let Project;
try {
    Project = mongoose.model('Project');
} catch (_) {
    const projectSchema = new mongoose.Schema({
        quoteRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'QuoteRequest' },
        quote:        { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
        owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        constructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status:       { type: String, default: 'pending' }
    }, { timestamps: true });
    Project = mongoose.model('Project', projectSchema);
}

exports.createQuoteRequest = async (req, res, next) => {
    try {
        const { plotId, projectType, numberOfFloors, totalArea,
                budgetMin, budgetMax, timelineStartDate, expectedDurationMonths, description } = req.body;

        const quoteRequest = await QuoteRequest.create({
            owner:   req.user._id,
            plot:    plotId || null,
            projectType, numberOfFloors, totalArea,
            budgetMin, budgetMax, timelineStartDate, expectedDurationMonths, description
        });

        res.status(201).json({ success: true, message: 'Quote request created successfully', data: { quoteRequest } });
    } catch (err) {
        next(err);
    }
};

exports.getQuoteRequests = async (req, res, next) => {
    try {
        const filter = { owner: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const quoteRequests = await QuoteRequest.find(filter)
            .populate('plot', 'streetAddress length width')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { quoteRequests } });
    } catch (err) {
        next(err);
    }
};

exports.getQuoteRequest = async (req, res, next) => {
    try {
        const qr = await QuoteRequest.findById(req.params.id).populate('plot', 'streetAddress length width');
        if (!qr) return res.status(404).json({ success: false, message: 'Quote request not found' });

        const isOwner       = qr.owner.toString() === req.user._id.toString();
        const isConstructor = req.user.role === 'constructor';
        if (!isOwner && !isConstructor) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: { quoteRequest: qr } });
    } catch (err) {
        next(err);
    }
};

exports.submitQuote = async (req, res, next) => {
    try {
        if (req.user.role !== 'constructor') {
            return res.status(403).json({ success: false, message: 'Only constructors can submit quotes' });
        }

        const { requestId, materialsCost, laborCost, permitsCost, otherCost,
                startDate, endDate, durationMonths, description } = req.body;

        const quote = await Quote.create({
            request:     requestId,
            constructor: req.user._id,
            materialsCost, laborCost, permitsCost, otherCost,
            startDate, endDate, durationMonths, description
        });

        await QuoteRequest.findByIdAndUpdate(requestId, { status: 'active' });

        res.status(201).json({ success: true, message: 'Quote submitted successfully', data: { quote } });
    } catch (err) {
        next(err);
    }
};

exports.getQuotes = async (req, res, next) => {
    try {
        let quotes;
        if (req.user.role === 'constructor') {
            quotes = await Quote.find({ constructor: req.user._id })
                .populate('request', 'projectType description status')
                .sort({ createdAt: -1 });
        } else {
            const requests = await QuoteRequest.find({ owner: req.user._id }).select('_id');
            const ids = requests.map(r => r._id);
            quotes = ids.length
                ? await Quote.find({ request: { $in: ids } })
                    .populate('constructor', 'firstName lastName email companyName')
                    .populate('request', 'projectType description status')
                    .sort({ createdAt: -1 })
                : [];
        }
        res.json({ success: true, data: { quotes } });
    } catch (err) {
        next(err);
    }
};

exports.acceptQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findById(req.params.id).populate('request');
        if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

        if (quote.request.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        quote.status = 'accepted';
        await quote.save();
        await QuoteRequest.findByIdAndUpdate(quote.request._id, { status: 'accepted' });

        await Project.create({
            quoteRequest: quote.request._id,
            quote:        quote._id,
            owner:        req.user._id,
            constructor:  quote.constructor
        });

        res.json({ success: true, message: 'Quote accepted successfully', data: { quote } });
    } catch (err) {
        next(err);
    }
};
