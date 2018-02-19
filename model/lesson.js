import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['lina', 'anal']
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
        delete ret._id;
    }
};

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
