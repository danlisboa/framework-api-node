const { createLogger, format, transports } = require('winston');
const LOG_SYSTEM = JSON.parse(process.env.LOG_SYSTEM);

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'comigo' },
  transports: [
    new transports.File({
      filename: 'combined.log',
      level: 'info',
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ]
});

module.exports = function (level, message, tag) {
  process.stdout.write('logging '+ LOG_SYSTEM +' ['+level+'] \n');

  if (LOG_SYSTEM) {
    logger.log({
      level: level,
      message: message,
      tag: tag
    });

    return;
  }

  process.stdout.write('message-log '+message+'\n');
};