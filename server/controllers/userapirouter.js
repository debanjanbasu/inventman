'use strict';
const router = require('koa-router')({
        prefix: '/userapi'
    }),
    jwt = require('jsonwebtoken'),
    config = require('../config.json'),
    MongoClient = require('mongodb'),
    bcrypt = require('bcrypt'),
    promisify = require('promisify-any');

// create route for adding user
router.post('/user', function*() {
    this.response.body = yield MongoClient.connect(config.dburl, {
        promiseLibrary: Promise
    }).then(db => {
        // hash the password
        let hashPass = promisify(bcrypt.hash, 2);
        return hashPass(this.request.body.password, 5).then(result => {
            if (result) {
                this.request.body.password = result;
                // return the db
                return db;
            } else {
                // close the database
                return db.close(true).then(result2 => {
                    // do nothing
                    return null;
                }).catch(error => {
                    throw error;
                });
                return null;
            }
        }).catch(error => {
            throw error;
        })
    }).then(db => {
        if (db) {
            return db.collection('users').insertOne({
                _id: this.request.body.username,
                password: this.request.body.password
            }).then(result => {
                // close the database
                return db.close(true).then(result2 => {
                    return result;
                }).catch(error => {
                    throw error;
                });
            }).then(result => {
                console.log('new user inserted into DB successfully');
                return "success";
            }).catch(error => {
                // close the database
                return db.close(true).then(result2 => {
                    // some error happened
                    // the db closed at least
                    throw error;
                }).catch(error2 => {
                    throw error2;
                });
            });
        }
    }).catch(error => {
        // connection error to DB
        console.log(error.message);
        return "fail";
    });
});
// function to create the token
function createToken(user) {
    return jwt.sign({
        username: user.username
    }, config.secret, {
        // 24x7x365 hours of expiry time for the token
        expiresIn: "365 days"
    });
}
// create route for creating a session
router.post('/sessions/create', function*() {
    this.response.body = yield MongoClient.connect(config.dburl, {
        promiseLibrary: Promise
    }).then(db => {
        return db.collection('users').findOne({
            _id: this.request.body.username
        }).then(result => {
            // close the database
            return db.close(true).then(result2 => {
                // return the actual result
                return result;
            }).catch(error => {
                throw error;
            });
        }).then(result => {
            if (result) {
                // async compare
                let comparePass = promisify(bcrypt.compare, 2);
                return comparePass(this.request.body.password, result.password).then(result2 => {
                    if (result2) {
                        // return the generated token
                        return createToken(result._id);
                    } else {
                        return "Wrong password provided";
                    }
                }).catch(error => {
                    throw error;
                });
            } else {
                return "No such user exists";
            }
        }).catch(error => {
            // close the database
            return db.close(true).then(result2 => {
                // some error happened
                // the db closed at least
                throw error;
            }).catch(error2 => {
                throw error2;
            });
        });
    }).catch(error => {
        // connection error to DB
        console.log(error.message);
        return "fail";
    });
});
// export the entire router
module.exports = router;
