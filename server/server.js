'use strict';
const express = require('express'),
    app = express(),
    spdy = require('spdy'),
    compression = require('compression'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    config = require('./config.json'),
    cluster_master = require('./cluster_server'),
    userApiRouter = require('./controllers/userapirouter'),
    inventmanApiRouter = require('./controllers/protectedinventmanapirouter'),
    jwt = require('express-jwt'),
    fs = require('fs');

// set environment as production
process.env.NODE_ENV = 'production';

// connect to inventman MongoDB Database
mongoose.connect(config.dburl);

// create the options for spdy
// create the spdy server
const spdy_options = {
    key: fs.readFileSync(__dirname + '/keys/spdy-key.pem'),
    cert: fs.readFileSync(__dirname + '/keys/spdy-cert.pem'),
    // **optional** SPDY-specific options
    spdy: {
        protocols: ['h2', 'spdy/3.1'],
        plain: false,
        connection: {
            windowSize: 1024 * 1024, // Server's window size

            // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
            autoSpdy31: true,
            maxStreams: 1024
        }
    }
};

// set express options
app.disable('x-powered-by');

// use compression to gZip all responses
app.use(compression({
    threshold: 0,
    level: 9,
    memLevel: 9
}));

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.options('*', cors());
app.use(cors());

// static route
app.use(express.static('client', {
    dotfiles: 'ignore',
    maxAge: 365 * 24 * 60 * 60 * 1000, //one year in milliseconds
    index: 'index.html'
}));

// routes for the inventmanApi
// This is where all working api routers are getting intialized
app.use('/userapi', userApiRouter);
// dashboard and login redirect router
app.get(['/dashboard', '/login'], (req, res) => {
    res.redirect(301, 'https://' + req.headers['host']);
});
// protected inventman api router using express-jwt middleware
app.use('/inventmanapi', jwt({
    secret: config.secret
}), inventmanApiRouter);

// Handle 404
app.use((req, res) => {
    res.status(404).send();
});

// Handle 500
app.use((error, req, res, next) => {
    res.status(500).send();
});

// combine the spdy and express server
const server = spdy.createServer(spdy_options, app);

// pass the servers to cluster master to handle the rest
cluster_master.startCluster(server);
