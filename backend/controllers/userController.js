const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
        res.json({ success: true, data: { user: req.user.getPublicProfile() } });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'phone'];
        const constructorOnly = ['companyName', 'bio', 'website'];

        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        if (req.user.role === 'constructor') {
            for (const key of constructorOnly) {
                if (req.body[key] !== undefined) updates[key] = req.body[key];
            }
        }

        const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.json({ success: true, message: 'Profile updated successfully', data: { user: updated.getPublicProfile() } });
    } catch (err) {
        next(err);
    }
};

exports.getBuilders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, specialization, serviceArea } = req.query;

        const filter = { role: 'constructor', isActive: true };
        if (specialization) filter.specializations = specialization;
        if (serviceArea) {
            filter.$or = [
                { city: new RegExp(serviceArea, 'i') },
                { province: new RegExp(serviceArea, 'i') }
            ];
        }

        const skip  = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const total = await User.countDocuments(filter);
        const docs  = await User.find(filter)
            .skip(skip)
            .limit(parseInt(limit, 10))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                builders: docs.map(u => u.getPublicProfile()),
                pagination: {
                    page:  parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    total,
                    pages: Math.ceil(total / parseInt(limit, 10))
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getBuilderById = async (req, res, next) => {
    try {
        const builder = await User.findConstructorById(req.params.id);
        if (!builder) return res.status(404).json({ success: false, message: 'Constructor not found' });
        res.json({ success: true, data: { builder: builder.getPublicProfile() } });
    } catch (err) {
        next(err);
    }
};
