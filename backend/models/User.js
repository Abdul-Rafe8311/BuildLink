const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const ROLE_MAP = {
    customer:    'owner',
    builder:     'constructor',
    owner:       'owner',
    constructor: 'constructor',
    admin:       'admin'
};

const userSchema = new mongoose.Schema({
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true, select: false },
    role:         { type: String, enum: ['owner', 'constructor', 'admin'], required: true },
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    phone:        { type: String, default: null },
    isActive:     { type: Boolean, default: true },
    isVerified:   { type: Boolean, default: false },
    trustScore:   { type: Number,  default: 0 },
    refreshToken: { type: String,  default: null, select: false },

    // Constructor-specific
    companyName:          { type: String, default: null },
    licenseNumber:        { type: String, default: null },
    yearsExperience:      { type: Number, default: 0 },
    bio:                  { type: String, default: null },
    website:              { type: String, default: null },
    minimumProjectBudget: { type: Number, default: null }
}, { timestamps: true });

// Virtual: expose _id as user_id so controllers keep working unchanged
userSchema.virtual('user_id').get(function () {
    return this._id;
});

userSchema.set('toJSON',   { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.getPublicProfile = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

// Static helpers
userSchema.statics.findByIdWithPassword = function (id) {
    return this.findById(id).select('+password +refreshToken');
};

userSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email }).select('+password');
};

userSchema.statics.updateRefreshToken = function (userId, token) {
    return this.findByIdAndUpdate(userId, { refreshToken: token });
};

userSchema.statics.findConstructorById = function (id) {
    return this.findOne({ _id: id, role: 'constructor', isActive: true });
};

// create() with role mapping
userSchema.statics.createUser = async function (data) {
    const roleName = ROLE_MAP[data.role] || data.role;
    const user = new this({ ...data, role: roleName });
    await user.save();
    return this.findById(user._id); // re-fetch without password
};

const User = mongoose.model('User', userSchema);
module.exports = User;
