import express from 'express';
import passport from 'passport'; 
import User from '../../model/user';

let router = express.Router();

router.get('/', (req, res) => {
    User.find().then(users => {
        res.json(users.map(user => { 
            return {
                _id: user._id,
                username: user.username,
                role: user.role
            };
        }));
    });
});

module.exports = router;