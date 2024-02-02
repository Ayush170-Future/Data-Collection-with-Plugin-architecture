const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

console.log(numCPUs)
if (cluster.isMaster) {
  // Master process
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker death
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Optionally, restart the worker to ensure clustering
    cluster.fork();
  });
} else {
  // Worker process
  require('./app.js');
}