'use strict';
const app = require('koa')(),
    compress = require('koa-compress'),
    spdy = require('spdy'),
    fs = require('fs'),
    http = require('http'),
    cluster = require('cluster'),
    redirectRouter = require('./controllers/redirectrouter'),
    userapiRouter = require('./controllers/userapirouter'),
    inventmanapiRouter = require('./controllers/inventmanapirouter');
// enable local insecure SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// create the HTTP2 SPDY options
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
// enable CORS
app.use(require('koa-cors')());
// initialize the compression middleware
app.use(compress({
    threshold: 0, // compress everything
    flush: require('zlib').Z_SYNC_FLUSH,
    level: require('zlib').Z_BEST_COMPRESSION
}));
// initialize the static client server from the client root folder
app.use(require('koa-static')('./client', {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    index: 'index.html',
    defer: true
}));
// enable the bodyparser
app.use(require('koa-bodyparser')());
// use the redirect router due to defer this might be called first
app.use(redirectRouter.routes())
    .use(redirectRouter.allowedMethods());
// the user API Router
app.use(userapiRouter.routes())
    .use(userapiRouter.allowedMethods());
// protected middleware
app.use(inventmanapiRouter.routes())
    .use(inventmanapiRouter.allowedMethods());

// create a cluster server with auto failsafe
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs and create a worker for each CPU
    for (let i of require('os').cpus()) {
        cluster.fork();
    }
    // Listen for dying workers
    cluster.on('exit', worker => {
        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
    // Code to run if we're in a worker process
} else {
    // create a tiny http redirect server
    http.createServer((req, res) => {
        res.writeHead(301, {
            "Location": "https://" + req.headers['host'] + req.url
        });
        res.end();
    }).listen(80);
    // initialize the http2 / spdy server
    spdy.createServer(spdy_options, app.callback()).listen(443);
    console.log('H2/SPDY server listening on port 443 and redirect server on 80');
    console.log('Worker ' + cluster.worker.id + ' running!');
}
