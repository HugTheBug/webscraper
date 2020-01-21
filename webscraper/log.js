const { createLogger, format, transports } = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const config = require('./config');

let transport = {};
let level = 'info';
if (process.env.ENV === 'development') {
  transport = new transports.Console();
  level = 'debug';
} else {
  transport = new LoggingWinston({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
  });
}

const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    transport,
  ],
  exceptionHandlers: [
    transport,
  ],
});

exports.logger = logger;
