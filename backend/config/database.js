const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is not set in environment variables');
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    });
};

module.exports = connectDB;
