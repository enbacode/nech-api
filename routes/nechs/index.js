import express from 'express';
import passport from 'passport';
import Nech from '../../model/nech';

let router = express.Router();

router.get('/', (req, res) => {
    Nech.find({}).then(nechs => {
        res.json(nechs);
    });
});

router.get('/:id', (req, res) => {
    Nech.findOne({ _id: req.params.id }).then(nech => {
        res.json(nech);
    });
});

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let nech = new Nech({ by: req.user._id });
        nech.save();
        res.json(nech);
    }
);

module.exports = router;
