'use strict';
const inventmanApiRouter = require('express').Router(),
    fetch = require('node-fetch'),
    config = require('../config.json');
// route to reply with username
inventmanApiRouter.route('/me')
    .get((req, res) => {
        res.json({
            'username': req.user.username
        });
    });

function getOrderPage(res, page) {
    // start syncing the database
    fetch('https://store-flx4x.mybigcommerce.com/api/v2/orders.json?limit=250&page=' + page, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + config.bigcommerceauth,
            },
            compress: true
        })
        .then(response => {
            return response.json();
        }).then(json => {
            console.log(json[249].date_created);
            return getOrderPage(res, ++page);
        }).catch(error => {
            if (error.message === 'Unexpected end of input') {
                res.json({
                    'status': 'success'
                });
            } else {
                // Any error other than EODB, maybe some network disruption!!
                res.json({
                    'status': 'failure'
                });
            }
        });
}

// route to sync DB
inventmanApiRouter.route('/syncdb')
    .get((req, res) => {
        getOrderPage(res, 1);
    });
// export the whole protected api router
module.exports = inventmanApiRouter;
