const fs = require('fs');

let count = 0;

function load(app) {

  logger.info("counters loaded");
  try {
    count = +fs.readFileSync('./counter.txt');
  } catch (e) {
    logger.info('counter.txt not found. Starting from 0');
  }

  app.server.use((req, res, next) => {
    count++;
    next();
  });

  app.server.get('/count', (req, res) => {
    res.send({ count });
  })
}

// Save request count for next time
function unload(app) {
  fs.writeFileSync('./counter.txt', count);
}

module.exports = {
  load,
  unload
};