module.exports = {
    session: {
        maxAge: 60000 * 20
    },
    mongoDb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        dbName: process.env.MONGODB_NAME || 'DynamicYield'
    },
    defaultUser : {
        name: process.env.DEFAULT_USER_NAME || 'admin',
        password: process.env.DEFAULT_USER_PASS || '1234'
    }
}