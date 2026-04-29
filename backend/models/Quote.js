const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    request:       { type: mongoose.Schema.Types.ObjectId, ref: 'QuoteRequest', required: true },
    constructor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
    materialsCost: { type: Number, required: true },
    laborCost:     { type: Number, required: true },
    permitsCost:   { type: Number, default: 0 },
    otherCost:     { type: Number, default: 0 },
    startDate:     { type: Date,   default: null },
    endDate:       { type: Date,   default: null },
    durationMonths:{ type: Number, default: null },
    description:   { type: String, default: null },
    status:        { type: String, default: 'pending',
                     enum: ['pending','accepted','rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
