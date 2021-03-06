import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import cors from 'cors';

import indexRoute from './routes/index';
import authRoute from './routes/auth/index';
import userRoute from './routes/users/index';
import meRoute from './routes/users/me';
import nechsRoute from './routes/nechs/index';
import lessonRoute from './routes/lessons/index';

import User from './model/user';
import Nech from './model/nech';
import Lesson from './model/lesson';
import config from './config';

if (process.env.NODE_ENV != 'production') require('dotenv').load();
config.db.connection = process.env.DB_CONNECTION || config.db.connection;
config.jwt.secret = process.env.JWT_SECRET || config.jwt.secret;
config.mail.service = process.env.MAIL_SERVICE || config.mail.service;
config.mail.user = process.env.MAIL_USER || config.mail.user;
config.mail.pass = process.env.MAIL_PASS || config.mail.pass;

const extractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken('');
jwtOptions.secretOrKey = config.jwt.secret;

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

let dbOptions = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    }
};

mongoose.connect(config.db.connection, dbOptions);

if (process.env.NODE_ENV != 'production') {
    let mock = require('./mock');
    User.remove({}).then(() => {
        User.create(mock.users);
    });
    Nech.remove({}).then(() => {
        Nech.create(mock.nechs);
    });
    Lesson.remove({}).then(() => {
        Lesson.create(mock.lessons);
    });
}

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(indexRoute);
app.use('/auth', authRoute);
app.use('/users/me', meRoute);
app.use('/users', userRoute);
app.use('/nechs', nechsRoute);
app.use('/lessons', lessonRoute);

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
