import express from 'express';
import Lesson from '../../model/lesson';

let router = express.Router();

router.get('/', (req, res) => {
    Lesson.find().then(lessons => {
        res.json(lessons);
    });
});

router.get('/next', (req, res) => {
    Lesson.find({ to: { $gte: Date.now() } })
        .sort({ date: -1 })
        .limit(1)
        .then(lesson => {
            if (!lesson) {
                res.json(null);
            } else {
                res.send(lesson);
            }
        });
});

router.get('/:id', (req, res) => {
    Lesson.findOne({ _id: req.params.id }).then(lesson => {
        if (!lesson) {
            res.sendStatus(404);
        } else {
            res.json(lesson);
        }
    });
});

module.exports = router;
