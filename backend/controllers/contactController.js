const ContactMessage = require('../models/ContactMessage');

/**
 * Submit contact message
 * POST /api/contact
 */
exports.submitMessage = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, userType, subject, message } = req.body;

        // Get metadata
        const metadata = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        };

        // Create contact message
        const contactMessage = await ContactMessage.create({
            firstName,
            lastName,
            email,
            phone,
            userType,
            subject,
            message,
            metadata
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you soon.',
            data: {
                id: contactMessage._id
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get all contact messages (Admin only - for future use)
 * GET /api/contact
 */
exports.getAllMessages = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = status ? { status } : {};

        const messages = await ContactMessage.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ContactMessage.countDocuments(query);

        res.json({
            success: true,
            data: {
                messages,
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
