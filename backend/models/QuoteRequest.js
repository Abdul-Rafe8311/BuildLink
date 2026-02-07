const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer is required']
    },

    plot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot',
        required: [true, 'Plot is required']
    },

    // Project details
    projectType: {
        type: String,
        required: [true, 'Project type is required'],
        enum: ['residential', 'commercial', 'renovation', 'custom'],
        trim: true
    },

    buildingType: {
        type: String,
        trim: true
    },

    numberOfFloors: {
        type: Number,
        min: 1,
        default: 1
    },

    totalArea: {
        type: Number,
        required: [true, 'Total area is required'],
        min: 0
    },

    // Budget and timeline
    budgetRange: {
        min: { type: Number, required: true, min: 0 },
        max: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'USD' }
    },

    timeline: {
        startDate: { type: Date },
        expectedDuration: { type: Number }, // in months
        isFlexible: { type: Boolean, default: true }
    },

    // Requirements
    requirements: {
        bedrooms: { type: Number, min: 0 },
        bathrooms: { type: Number, min: 0 },
        parking: { type: Number, min: 0 },
        specialFeatures: [{ type: String, trim: true }]
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },

    // Preferences
    preferences: {
        energyEfficient: { type: Boolean, default: false },
        sustainableMaterials: { type: Boolean, default: false },
        modernDesign: { type: Boolean, default: false }
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },

    quotesReceived: {
        type: Number,
        default: 0
    },

    expiresAt: {
        type: Date,
        default: function () {
            // Expire after 30 days
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    }
}, {
    timestamps: true
});

// Index for efficient queries
quoteRequestSchema.index({ customer: 1, status: 1 });
quoteRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
