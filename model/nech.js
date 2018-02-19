import mongoose from 'mongoose';

const NechSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['nech', 'klar', 'trivial']
    },
    date: {
        type: Date,
        default: Date.now
    },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

NechSchema.options.toJSON = {
    getters: true,
    virtuals: true,
    minimize: false,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
    }
};

const Nech = mongoose.model('Nech', NechSchema);

module.exports = Nech;
