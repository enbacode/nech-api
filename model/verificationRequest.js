import mongoose from 'mongoose';

const VerificationRequestSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String
    },
    token: {
        type: String,
        default: Math.floor(Math.random() * 900000) + 100000
    }
});

const VerificationRequest = mongoose.model(
    'VerificationRequest',
    VerificationRequestSchema
);

module.exports = VerificationRequest;
