const mongoose = require('mongoose');

const budgetAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Input parameters
    input: {
        plotArea: { type: Number, required: true, min: 0 },
        buildingArea: { type: Number, required: true, min: 0 },
        numberOfFloors: { type: Number, required: true, min: 1 },
        buildingType: {
            type: String,
            required: true,
            enum: ['residential', 'commercial', 'industrial', 'mixed']
        },
        location: {
            city: { type: String, trim: true },
            state: { type: String, trim: true }
        },
        qualityLevel: {
            type: String,
            enum: ['basic', 'standard', 'premium', 'luxury'],
            default: 'standard'
        }
    },

    // Analysis results
    results: {
        // Cost breakdown
        construction: {
            foundation: { type: Number, min: 0 },
            structure: { type: Number, min: 0 },
            roofing: { type: Number, min: 0 },
            walls: { type: Number, min: 0 },
            flooring: { type: Number, min: 0 },
            electrical: { type: Number, min: 0 },
            plumbing: { type: Number, min: 0 },
            hvac: { type: Number, min: 0 },
            finishing: { type: Number, min: 0 }
        },

        // Additional costs
        permits: { type: Number, min: 0 },
        design: { type: Number, min: 0 },
        contingency: { type: Number, min: 0 },

        // Totals
        subtotal: { type: Number, min: 0 },
        total: { type: Number, min: 0 },

        // Per unit costs
        costPerSqFt: { type: Number, min: 0 },

        // Timeline estimate
        estimatedDuration: { type: Number, min: 0 } // in months
    },

    // Recommendations
    recommendations: [{
        category: { type: String, trim: true },
        suggestion: { type: String, trim: true },
        potentialSavings: { type: Number, min: 0 }
    }],

    // Comparison data
    marketComparison: {
        averageCost: { type: Number, min: 0 },
        percentageDifference: { type: Number },
        priceRange: {
            low: { type: Number, min: 0 },
            high: { type: Number, min: 0 }
        }
    }
}, {
    timestamps: true
});

// Index for user queries
budgetAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('BudgetAnalysis', budgetAnalysisSchema);
