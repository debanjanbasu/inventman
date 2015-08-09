'use strict';
const inventmanApiRouter = require('express').Router();

inventmanApiRouter.route('/me')
    .get((req, res) => {
        res.json({
            'username': req.user.username
        });
    });
// export the whole protected api router
module.exports = inventmanApiRouter;
