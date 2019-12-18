// noinspection SpellCheckingInspection
module.exports = {
    session: {
        maxAge: 60000 * 20
    },
    logger: {
        logLevel: "debug", //emerg, alert, crit, error, warning, notice, info, debug
        cappedSize: Math.pow(1024, 3), //1Giga
        expireAfterSeconds: 86400 * 365 //One year
    },
    mongoDb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        dbName: process.env.MONGODB_NAME || 'DynamicYield'
    },
    defaultUser : {
        name: process.env.DEFAULT_USER_NAME || 'admin',
        password: process.env.DEFAULT_USER_PASS || '1234'
    }
};