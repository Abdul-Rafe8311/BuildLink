const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Authorization denied.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.message && error.message.includes('expired')) {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please refresh your token.',
                code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(401).json({ success: false, message: 'Invalid token. Authorization denied.' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'User not authenticated' });
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. Required role: ${roles.join(' or ')}`
        });
    }
    next();
};

module.exports = { authenticate, authorize };
