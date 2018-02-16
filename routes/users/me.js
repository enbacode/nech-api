import express from 'express';
import passport from 'passport'; 

let router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;