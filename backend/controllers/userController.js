const User = require('../models/User');

/**
 * Get user profile
 * GET /api/users/profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user.getPublicProfile()
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['firstName', 'lastName', 'phone', 'bio', 'website'];
        const builderUpdates = ['companyName', 'specializations', 'serviceAreas'];

        // Filter allowed fields
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
            if (req.user.role === 'builder' && builderUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Update user
        Object.assign(req.user, updates);
        await req.user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: req.user.getPublicProfile()
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get all builders (public)
 * GET /api/users/builders
 */
exports.getBuilders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, specialization, serviceArea } = req.query;

        const query = { role: 'builder', isActive: true };

        if (specialization) {
            query.specializations = { $in: [specialization] };
        }

        if (serviceArea) {
            query.serviceAreas = { $in: [serviceArea] };
        }

        const builders = await User.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                builders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get builder by ID (public)
 * GET /api/users/builders/:id
 */
exports.getBuilderById = async (req, res, next) => {
    try {
        const builder = await User.findOne({
            _id: req.params.id,
            role: 'builder',
            isActive: true
        }).select('-password -refreshToken');

        if (!builder) {
            return res.status(404).json({
                success: false,
                message: 'Builder not found'
            });
        }

        res.json({
            success: true,
            data: {
                builder
            }
        });

    } catch (error) {
        next(error);
    }
};
