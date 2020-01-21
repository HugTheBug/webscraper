const express = require('express');

const query = require('./query');
const parser = require('./parser');
const { logger } = require('./log');
const data = require('./data');

const app = express();
const port = process.env.PORT || 8080;

const updatePosts = async () => {
  logger.info('starting posts update');
  data.getLastId()
    .then(query.fetchUntilId)
    .then(data.updateLastId)
    .then(parser.filterLinks)
    .then(data.addLinks)
    .then(async (links) => logger.info(links));
};

app.get('/', (req, res) => {
  res
    .status(200)
    .send('and here is nothing');
});

app.get('/update', (req, res) => {
  if (req.get('X-Appengine-Cron')) {
    updatePosts();
    res.status(200).send('updating...');
  } else {
    res.status(404);
  }
});

app.listen(port, () => {
  logger.info(`app listening on port ${port}`);
});

module.exports = app;
