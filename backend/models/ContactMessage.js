const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },

    phone: {
        type: String,
        trim: true
    },

    userType: {
        type: String,
        required: [true, 'User type is required'],
        enum: ['customer', 'builder', 'other'],
        trim: true
    },

    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },

    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },

    // Status tracking
    status: {
        type: String,
        enum: ['new', 'read', 'responded', 'archived'],
        default: 'new'
    },

    // Admin response
    response: {
        message: { type: String, trim: true },
        respondedBy: { type: String, trim: true },
        respondedAt: { type: Date }
    },

    // IP and metadata (for spam prevention)
    metadata: {
        ipAddress: { type: String },
        userAgent: { type: String }
    }
}, {
    timestamps: true
});

// Index for efficient queries
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
