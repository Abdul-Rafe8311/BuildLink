const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    owner:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    projectType:      String,
    totalArea:        Number,
    floors:           Number,
    location:         String,
    quality:          String,
    estimatedMin:     Number,
    estimatedMax:     Number,
    breakdown:        { type: mongoose.Schema.Types.Mixed, default: {} },
    aiRecommendation: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('BudgetAnalysis', budgetSchema);
