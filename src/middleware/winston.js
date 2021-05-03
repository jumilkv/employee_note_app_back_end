const winston = require('winston')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error', 'timestamp': true, maxsize: 10485760 }),
        new winston.transports.File({ filename: './logs/combinedLog/combined.log', 'timestamp': true, maxsize: 20971520 })
    ],

});
module.exports = logger;