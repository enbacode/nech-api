import express from 'express';
import User from '../../model/user';
import { body, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import jwt from 'jsonwebtoken';

let router = express.Router();
const secret = process.env.JWT_SECRET || '';

router.post(
    '/register',
    [
        body('username')
            .exists()
            .withMessage('no username specified')
            .trim()
            .isAlphanumeric()
            .withMessage('username must be alphanumeric')
            .isLength({ max: 32 })
            .withMessage('username must be shorter than 32 characters')
            .custom(value => {
                return User.findOne({ username: value })
                    .then(user => {
                        if (user) throw new Error('username already in use');
                    })
                    .catch(err => {
                        throw err;
                    });
            }),

        body('password')
            .exists()
            .withMessage('no password specified')
            .isLength({ min: 8 })
            .withMessage('password must be at least 8 characters long')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }
        const body = matchedData(req);
        const user = new User({
            username: body.username,
            password: body.password
        });
        user.save((err, result) => {
            res.json(result);
        });
    }
);

router.post(
    '/login',
    [
        body('username')
            .exists()
            .withMessage('no username specified')
            .custom(value => {
                return User.findOne({ username: value })
                    .then(user => {
                        if (!user) throw new Error('user not found');
                    })
                    .catch(err => {
                        throw err;
                    });
            }),
        body('password')
            .exists()
            .withMessage('no password specified')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }
        const body = matchedData(req);

        User.findOne({ username: body.username })
            .then(user => {
                user.comparePassword(body.password, (err, match) => {
                    if (err) throw err;
                    if (match) {
                        let payload = {
                            user: user,
                            loggedIn: true
                        };
                        let token = jwt.sign(payload, secret);
                        res.json({ user: user, token: token });
                    } else {
                        res.status(400).json({ msg: 'invalid password' });
                    }
                });
            })
            .catch(err => {
                throw err;
            });
    }
);

module.exports = router;
