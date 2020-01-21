const cron = require('cron');
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

app.get('/links', async (req, res) => res.status(200).json(await data.getLinks()));

app.get('/lastid', async (req, res) => res.status(200).json(await data.getLastId()));

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, world!');
});

app.get('/forceupdate', (req, res) => {
  updatePosts();
  res
    .status(200)
    .send('forced update');
});

app.listen(port, () => {
  logger.info(`app listening on port ${port}`);

  const job = new cron.CronJob('00 00 08,20 * * *', () => {
    updatePosts();
  });

  job.start();
  logger.info('started cron job');
});

module.exports = app;
