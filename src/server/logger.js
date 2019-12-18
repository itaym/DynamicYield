const expressWinston = require('express-winston');
const winston = require('winston');
const { MongoDB } = require('winston-mongodb');
const Settings = require('./Settings');

const logger = expressWinston.logger({
    transports: [
        winston.add(new MongoDB({
            db : `${Settings.mongoDb.url}/${Settings.mongoDb.dbName}`,
            collection : 'winston',
            cappedSize: Settings.logger.cappedSize,
            expireAfterSeconds: Settings.logger.expireAfterSeconds,
            capped : true,
            level : Settings.logger.logLevel,
            format: winston.format.metadata(),
            expressFormat: true,
        }))
    ],
    meta: true,
    level:Settings.logger.logLevel,
    msg: function (req, res) {
        return `${req.user ? req.user.name : 'NO-USER'}, ${res.statusCode}, ${req.method}, ${req.url}`;
    }
});

module.exports = logger;