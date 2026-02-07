const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quoteRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuoteRequest',
        required: [true, 'Quote request is required']
    },

    builder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Builder is required']
    },

    // Pricing breakdown
    pricing: {
        materials: { type: Number, required: true, min: 0 },
        labor: { type: Number, required: true, min: 0 },
        permits: { type: Number, default: 0, min: 0 },
        equipment: { type: Number, default: 0, min: 0 },
        contingency: { type: Number, default: 0, min: 0 },
        other: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 }
    },

    // Timeline
    timeline: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        durationMonths: { type: Number, required: true, min: 0 },
        milestones: [{
            name: { type: String, trim: true },
            date: { type: Date },
            description: { type: String, trim: true }
        }]
    },

    // Details
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },

    methodology: {
        type: String,
        trim: true
    },

    materials: [{
        name: { type: String, trim: true },
        specification: { type: String, trim: true },
        quantity: { type: Number },
        unit: { type: String, trim: true }
    }],

    // Terms and conditions
    terms: {
        paymentSchedule: { type: String, trim: true },
        warranty: { type: String, trim: true },
        insurance: { type: String, trim: true },
        additionalTerms: { type: String, trim: true }
    },

    // Validity
    validUntil: {
        type: Date,
        required: true,
        default: function () {
            // Valid for 30 days
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    },

    // Status
    status: {
        type: String,
        enum: ['submitted', 'viewed', 'accepted', 'rejected', 'expired'],
        default: 'submitted'
    },

    // Customer response
    customerNotes: {
        type: String,
        trim: true
    },

    acceptedAt: {
        type: Date
    },

    rejectedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Calculate total automatically
quoteSchema.pre('save', function (next) {
    if (this.pricing) {
        this.pricing.total =
            (this.pricing.materials || 0) +
            (this.pricing.labor || 0) +
            (this.pricing.permits || 0) +
            (this.pricing.equipment || 0) +
            (this.pricing.contingency || 0) +
            (this.pricing.other || 0);
    }
    next();
});

// Index for efficient queries
quoteSchema.index({ quoteRequest: 1, builder: 1 });
quoteSchema.index({ builder: 1, status: 1 });

module.exports = mongoose.model('Quote', quoteSchema);
