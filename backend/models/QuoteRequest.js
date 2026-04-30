const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
    owner:                  { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    plot:                   { type: mongoose.Schema.Types.ObjectId, ref: 'Plot',  default: null },
    projectType:            { type: String, required: true },
    numberOfFloors:         { type: Number, default: 1 },
    totalArea:              { type: Number, default: null },
    budgetMin:              { type: Number, default: null },
    budgetMax:              { type: Number, default: null },
    currency:               { type: String, default: 'USD' },
    timelineStartDate:      { type: Date,   default: null },
    expectedDurationMonths: { type: Number, default: null },
    description:            { type: String, default: null },
    status:                 { type: String, default: 'pending',
                              enum: ['pending','active','accepted','rejected','completed'] }
}, { timestamps: true });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
