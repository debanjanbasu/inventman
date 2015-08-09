'use strict';
const cluster = require('cluster');

exports.startCluster = (app, server) => {
    // Code to run if we're in the master process
    if (cluster.isMaster) {

        // Count the machine's CPUs
        const cpuCount = require('os').cpus().length;

        // Create a worker for each CPU
        for (let i = 0; i < cpuCount; i++) {
            cluster.fork();
        }

        // Listen for dying workers
        cluster.on('exit', function (worker) {

            // Replace the dead worker, we're not sentimental
            console.log('Worker ' + worker.id + ' died :(');
            cluster.fork();

        });

        // Code to run if we're in a worker process
    } else {

        // Bind to ports port
        app.listen(80);
        console.log('Redirect server listening on port 80');
        server.listen(443);
        console.log('SPDY server listening on port 443');

        console.log('Worker ' + cluster.worker.id + ' running!');
    }
}
