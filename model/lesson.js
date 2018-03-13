import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['LA', 'ANA']
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    }
});

LessonSchema.options.toJSON = {
    getters: true,
    virtuals: true,
    minimize: false,
    transform: (doc, ret) => {
        delete ret.__v;
    }
};

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
