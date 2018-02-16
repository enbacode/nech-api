import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema =  new mongoose.Schema({
    username: String,
    email: String,
    eduMail: String,
    password: String,
    role: {
        type: String,
        enum: ['super', 'admin', 'moderator', 'trusted', 'verified', 'unverified']
    }
});

UserSchema.pre('save', function(next) {
    const user = this;
    
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {

        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {

            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;