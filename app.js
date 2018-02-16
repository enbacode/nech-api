import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from 'passport-jwt';

import indexRoute from './routes/index';
import authRoute from './routes/auth/index';

import User from './model/user';

if(process.env.NODE_ENV != 'production') 
require('dotenv').load();

const extractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passport.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'notproductionready';

passport.use('jwt', new JwtStrategy(jwtOptions, (payload, done) => {
    User.findOne({ username: payload.username }, (err, user) => {
        if(err) return done(err, false);
        if(user) return done(null, user);
        else return done(null, false);
    });
}));

let app = express();

mongoose.connect(process.env.DB_CONNECTION || 'localhost');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(indexRoute);
app.use('/auth', authRoute);


app.use((req, res, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  

module.exports = app;