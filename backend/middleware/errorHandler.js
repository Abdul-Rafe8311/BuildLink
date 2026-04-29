const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Mongoose duplicate key (e.g. unique email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(400).json({
            success: false,
            message: `An account with that ${field} already exists.`
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
