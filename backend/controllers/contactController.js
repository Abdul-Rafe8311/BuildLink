const ContactMessage = require('../models/ContactMessage');

exports.submitMessage = async (req, res, next) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;
        const cm = await ContactMessage.create({ firstName, lastName, email, subject, message });
        res.status(201).json({
            success: true,
            message: "Message sent successfully! We'll get back to you soon.",
            data: { id: cm._id }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllMessages = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page  || 1,  10);
        const limit = parseInt(req.query.limit || 20, 10);
        const skip  = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            ContactMessage.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                messages,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (err) {
        next(err);
    }
};
