const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['customer', 'builder'],
        required: [true, 'Role is required']
    },

    // Common fields
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
    phone: {
        type: String,
        trim: true
    },

    // Builder-specific fields
    companyName: {
        type: String,
        trim: true,
        required: function () { return this.role === 'builder'; }
    },
    licenseNumber: {
        type: String,
        trim: true,
        required: function () { return this.role === 'builder'; }
    },
    yearsExperience: {
        type: Number,
        min: 0,
        required: function () { return this.role === 'builder'; }
    },
    specializations: [{
        type: String,
        trim: true
    }],
    serviceAreas: [{
        type: String,
        trim: true
    }],
    bio: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },

    // Status and verification
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Refresh token for JWT
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
};

module.exports = mongoose.model('User', userSchema);
