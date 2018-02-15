import mongoose from 'mongoose';

const NechSchema =  new mongoose.Schema({
    type: {
        type: String,
        enum: ['nech', 'klar', 'trivial']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Nech = mongoose.model('Nech', NechSchema);

module.exports = Nech;