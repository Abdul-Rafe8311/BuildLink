const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
    try {
        const { email, password, role, firstName, lastName, phone, ...extra } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.createUser({ email, password, role, firstName, lastName, phone, ...extra });

        const accessToken  = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });
        await User.updateRefreshToken(user._id, refreshToken);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: user.getPublicProfile(), accessToken, refreshToken }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findByEmailWithPassword(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
        }

        const accessToken  = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });
        await User.updateRefreshToken(user._id, refreshToken);

        res.json({
            success: true,
            message: 'Login successful',
            data: { user: user.getPublicProfile(), accessToken, refreshToken }
        });
    } catch (err) {
        next(err);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token is required' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        res.json({ success: true, data: { accessToken } });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await User.updateRefreshToken(req.user._id, null);
        res.json({ success: true, message: 'Logout successful' });
    } catch (err) {
        next(err);
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        res.json({ success: true, data: { user: req.user.getPublicProfile() } });
    } catch (err) {
        next(err);
    }
};
