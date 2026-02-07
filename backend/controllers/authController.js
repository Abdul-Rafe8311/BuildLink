const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
    try {
        const { email, password, role, firstName, lastName, phone, ...builderFields } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user data
        const userData = {
            email,
            password,
            role,
            firstName,
            lastName,
            phone
        };

        // Add builder-specific fields if role is builder
        if (role === 'builder') {
            Object.assign(userData, {
                companyName: builderFields.companyName,
                licenseNumber: builderFields.licenseNumber,
                yearsExperience: builderFields.yearsExperience,
                specializations: builderFields.specializations,
                serviceAreas: builderFields.serviceAreas,
                bio: builderFields.bio,
                website: builderFields.website
            });
        }

        // Create user
        const user = await User.create(userData);

        // Generate tokens
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });

        res.json({
            success: true,
            data: {
                accessToken
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
    try {
        // Clear refresh token
        req.user.refreshToken = null;
        await req.user.save();

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get current user
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res, next) => {
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
