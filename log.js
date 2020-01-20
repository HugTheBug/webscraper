const { createLogger, format, transports } = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const config = require('./config');

const loggingWinston = new LoggingWinston({
  projectId: config.projectId,
  keyFilename: config.keyFilename,
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    loggingWinston,
  ],
  exceptionHandlers: [
    new transports.Console(),
    loggingWinston,
  ],
});

exports.logger = logger;
