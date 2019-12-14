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
    }
};