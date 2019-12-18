const expressWinston = require('express-winston');
const winston = require('winston');
const { MongoDB } = require('winston-mongodb');
const Settings = require('./Settings');

function getBody (req) {
    const json = Object.assign({}, req.body, req.query);

    delete json.password;
    return JSON.stringify(json);
}

const logger = expressWinston.logger({
    transports: [
        winston.add(new MongoDB({
            db : `${Settings.mongoDb.url}/${Settings.mongoDb.dbName}`,
            collection : 'winston',
            cappedSize: Settings.logger.cappedSize,
            cappedMax: Settings.logger.cappedMax,
            capped : true,
            json: true,
            level : Settings.logger.logLevel,
            expressFormat: true,
        }))
    ],
    meta: true,
    level:Settings.logger.logLevel,
    msg: function (req, res) {
        // noinspection JSUnresolvedVariable
        return `${req.user ? req.user.name : 'NO-USER'}, ${res.statusCode}, ${req.method}, ${req.url}, ${getBody(req)}, ${req.get('user-agent')}`;
    }
});

module.exports = logger;