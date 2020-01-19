const { createLogger, format, transports } = require('winston');

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
    new transports.File({ filename: './logs/log.txt' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: './logs/exceptions.txt' }),
  ],
});

exports.logger = logger;
