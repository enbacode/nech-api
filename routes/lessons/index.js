import express from 'express';
import Lesson from '../../model/lesson';
import { body, validationResult } from 'express-validator/check';
import passport from 'passport';
import { matchedData } from 'express-validator/filter';

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

router.post(
    '/',
    [
        body('type')
            .exists()
            .isIn(['ANA', 'LA']),
        body('from')
            .exists()
            .isISO8601(),
        body('to')
            .exists()
            .isISO8601()
    ],
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }
        if (['super', 'admin', 'moderator'].indexOf(req.user.role) < 0) {
            res.sendStatus(401);
        }

        const body = matchedData(req);

        const lesson = new Lesson({
            type: body.type,
            from: body.from,
            to: body.to
        });

        lesson.save((err, result) => {
            res.json(result);
        });
    }
);

module.exports = router;
