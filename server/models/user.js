'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
// Define our user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Execute before each user.save() call
UserSchema.pre('save', callback => {
    const user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }
    // Password changed so we need to hash it
    bcrypt.genSalt(5, (err, salt) => {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});
// method to compare the hashed password
UserSchema.methods.verifyPassword = (password, callback) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};
// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
