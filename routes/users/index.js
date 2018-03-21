import express from 'express';
import User from '../../model/user';
import Nech from '../../model/nech';
import mock from '../../mock';

let router = express.Router();

router.get('/', (req, res) => {
    User.find().then(users => {
        res.json(users);
    });
});

router.get('/heavy', (req, res) => {
    res.send(mock.nechs);
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

router.get('/:name/nechs', (req, res) => {
    User.findOne({ username: req.params.name }).then(user => {
        if (!user) {
            res.sendStatus(404);
        } else {
            Nech.find({ by: user._id }).then(nechs => {
                res.json(nechs);
            });
        }
    });
});

router.get('/:name/nechs/:type(nech|klar|trivial)', (req, res) => {
    User.findOne({ username: req.params.name }).then(user => {
        if (!user) {
            res.sendStatus(404);
        } else {
            Nech.find({ by: user._id, type: req.params.type }).then(nechs => {
                res.json(nechs);
            });
        }
    });
});

module.exports = router;
