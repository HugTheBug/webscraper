const cron = require('cron');
const express = require('express');

const query = require('./query');
const parser = require('./parser');
const logger = require('./logger');
const data = require('./data');

const app = express();
const port = 8080;

app.get('/links', async (req, res) => res.status(200).json(await data.getLinks()));

app.get('/id', async (req, res) => res.status(200).json(await data.getLastId()));

app.listen(port, () => {
  logger.log(`app listening on port ${port}`);

  const job = new cron.CronJob('00 00 08,20 * * *', () => {
    logger.log('starting posts updating');
    data.getLastId()
      .then(query.fetchUntilId)
      .then(data.updateLastId)
      .then(parser.filterLinks)
      .then(data.addLinks)
      .then(logger.log);
  });

  job.start();
  logger.log('started cron job');
});
