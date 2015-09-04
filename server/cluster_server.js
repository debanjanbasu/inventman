'use strict';
const cluster = require('cluster'),
    http = require(('http'));

exports.startCluster = (server) => {
    // Code to run if we're in the master process
    if (cluster.isMaster) {

        // Count the machine's CPUs
        const cpuCount = require('os').cpus().length;

        // Create a worker for each CPU
        for (let i = 0; i < cpuCount; i++) {
            cluster.fork();
        }

        // Listen for dying workers
        cluster.on('exit', function(worker) {

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
        // Bind to ports port
        server.listen(443);
        console.log('H2/SPDY server listening on port 443 and redirect server on 80');

        console.log('Worker ' + cluster.worker.id + ' running!');
    }
}
