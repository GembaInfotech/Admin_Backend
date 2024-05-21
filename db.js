const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Add any options you need here
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { connect };
