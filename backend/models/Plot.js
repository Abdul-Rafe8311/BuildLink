const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Plot owner is required']
    },

    // Location details
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
        country: { type: String, default: 'USA', trim: true }
    },

    // Plot details
    dimensions: {
        length: { type: Number, required: true, min: 0 },
        width: { type: Number, required: true, min: 0 },
        unit: { type: String, enum: ['feet', 'meters'], default: 'feet' }
    },

    area: {
        type: Number,
        required: true,
        min: 0
    },

    soilType: {
        type: String,
        enum: ['clay', 'sandy', 'loamy', 'rocky', 'mixed', 'unknown'],
        default: 'unknown'
    },

    // Utilities
    utilities: {
        water: { type: Boolean, default: false },
        electricity: { type: Boolean, default: false },
        gas: { type: Boolean, default: false },
        sewer: { type: Boolean, default: false }
    },

    // Additional info
    zoning: {
        type: String,
        trim: true
    },

    topography: {
        type: String,
        enum: ['flat', 'sloped', 'hilly', 'mixed'],
        default: 'flat'
    },

    notes: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'sold'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Calculate area automatically
plotSchema.pre('save', function (next) {
    if (this.dimensions.length && this.dimensions.width) {
        this.area = this.dimensions.length * this.dimensions.width;
    }
    next();
});

module.exports = mongoose.model('Plot', plotSchema);
