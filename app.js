import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportJWT from 'passport-jwt';

import indexRoute from './routes/index';
import authRoute from './routes/auth/index';
import userRoute from './routes/users/index';
import meRoute from './routes/users/me';
import nechsRoute from './routes/nechs/index';

import User from './model/user';
import Nech from './model/nech';

if (process.env.NODE_ENV != 'production') require('dotenv').load();

const extractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken('');
jwtOptions.secretOrKey = process.env.JWT_SECRET || '';

passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, (payload, done) => {
        User.findOne({ username: payload.user.username }, (err, user) => {
            if (err) return done(err, false);
            if (user) return done(null, user);
            else return done(null, false);
        });
    })
);

let app = express();

mongoose.connect(process.env.DB_CONNECTION || 'localhost');

if (process.env.NODE_ENV != 'production') {
    let mock = require('./mock');
    User.remove({}).then(() => {
        User.create(mock.users);
    });
    Nech.remove({}).then(() => {
        Nech.create(mock.nechs);
    });
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(indexRoute);
app.use('/auth', authRoute);
app.use('/users/me', meRoute);
app.use('/users', userRoute);
app.use('/nechs', nechsRoute);

app.use((req, res, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res) => {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.sendStatus(err.status || 500);
});

module.exports = app;
