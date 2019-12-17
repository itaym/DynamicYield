const crypto = require('crypto');

module.exports = {
    getResponseObject (success, statusCode, data, error) {
        return {
            success,
            statusCode,
            data,
            error
        }
    },
    dateFromObjectId (objectId) {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    },
    genRandomString (length){
        return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
    },
    sha512 (password, salt){
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt:salt,
            hash:value
        };
    }
};