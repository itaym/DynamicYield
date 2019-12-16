const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const MongoDb = require('../MongoDb');
const authentication = require('../Authentication');
const { getResponseObject } = require('../utils');

router.use(authentication.authMiddleware);

/* GET rooms. */
router.get('/', async function(req, res) {
    let statusCode = HttpStatus.OK;
    try {
        let rooms = await MongoDb.getRooms();
        return res.status(statusCode).send(getResponseObject(true, statusCode, rooms, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* ADD room. */
router.post('/', async function(req, res) {
    const name = req.body.name;
    let statusCode = HttpStatus.OK;

    if (!name) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, 'Cannot add an invalid room.'));
    }

    try {
        await MongoDb.addRoom(name);
        return res.status(statusCode).send(getResponseObject(true, statusCode, {name}, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* DELETE room. */
router.delete('/', async function(req, res) {
    const name = req.body.name;
    let statusCode = HttpStatus.OK;

    try {
        await MongoDb.delRoom(name);
        return res.status(statusCode).send(getResponseObject(true, statusCode, {name}, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

module.exports = router;