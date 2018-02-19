import express from 'express';
import User from '../../model/user';

let router = express.Router();

router.get('/', (req, res) => {
    User.find().then(users => {
        res.json(users);
    });
});

router.get('/:name', (req, res) => {
    User.findOne({ username: req.params.name }).then(user => {
        if (!user) {
            res.sendStatus(404);
        } else {
            res.json(user);
        }
    });
});

module.exports = router;
