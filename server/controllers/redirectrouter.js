'use strict';
const router = require('koa-router')();
// create the routes for the router
router.get('/login', function*() {
    this.redirect('/');
    this.status = 301;
});
router.get('/dashboard', function*() {
    this.redirect('/');
    this.status = 301;
});
// export the entire router
module.exports = router;
