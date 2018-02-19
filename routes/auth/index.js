import express from 'express';
import User from '../../model/user';
import { body, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import VerificationRequest from '../../model/verificationRequest';
import config from '../../config';

let router = express.Router();

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
                        let token = jwt.sign(payload, config.jwt.secret);
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

router.post(
    '/verify',
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
        body('email')
            .exists()
            .withMessage('no email specified')
            .isEmail()
            .withMessage('specified address is not an email')
            .normalizeEmail()
            .matches(/(.*)@tu-braunschweig\.de/)
            .withMessage('email is not a valid educational address')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }
        const body = matchedData(req);

        const transporter = nodeMailer.createTransport({
            service: config.mail.service,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });

        User.findOne({ username: body.username })
            .then(user => {
                const vRequest = new VerificationRequest({
                    user: user,
                    email: body.email
                });
                vRequest.save();
                return vRequest;
            })
            .then(vRequest => {
                transporter.sendMail(
                    {
                        from: 'verify@doktorne.ch',
                        to: body.email,
                        subject: 'Verify your mail',
                        text: `Enter verification code: ${vRequest.token}`
                    },
                    error => {
                        if (error) {
                            res.sendStatus(500);
                            console.log(error);
                        } else {
                            res.sendStatus(200);
                        }
                    }
                );
            });
    }
);

router.get('/verify/:token', (req, res) => {
    VerificationRequest.findOne({ token: req.params.token }).then(vRequest => {
        if (vRequest) {
            User.findOne({ _id: vRequest.user })
                .then(user => {
                    user.eduMail = vRequest.email;
                    if (user.role == 'unverified') {
                        user.role = 'verified';
                    }
                    user.save();
                })
                .then(() => {
                    vRequest.remove();
                    res.sendStatus(200);
                });
        } else {
            res.status(400).send('invalid token');
        }
    });
});

module.exports = router;
