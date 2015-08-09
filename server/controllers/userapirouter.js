'use strict';
const userApiRouter = require('express').Router(),
    User = require('../models/user'),
    config = require('../config.json'),
    jwt = require('jsonwebtoken');

// configure the routes
userApiRouter.route('/user')
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.save(err => {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'New user added to the inventman app!'
            });
        });
    });
// return all users
userApiRouter.route('/users')
    .get((req, res) => {
        User.find((err, users) => {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

function createToken(user) {
    return jwt.sign({
        username: user.username
    }, config.secret, {
        // 5 hours of expiry time for the token
        expiresInMinutes: 60 * 5
    });
}
// returns a jwt for the user signup
userApiRouter.route('/sessions/create')
    .post((req, res) => {
        User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                res.send(err);
            }
            // No user found with that username
            if (!user) {
                res.json({
                    message: 'no user with that username exist!'
                });
            } else if (user) {
                // Make sure the password is correct
                user.verifyPassword(req.body.password, (err, isMatch) => {
                    if (err) {
                        res.send(err);
                    }

                    // Password did not match
                    if (!isMatch) {
                        res.json({
                            message: 'password does not match with the provided username!'
                        });
                    }
                    // Success
                    res.status(201).send({
                        id_token: createToken(user)
                    });
                });
            }
        });
    });
// export the entire router as a module
module.exports = userApiRouter;
