const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const MongoDb = require('../mongoDb/MongoDb');
const authentication = require('../Authentication');
const { getResponseObject } = require('../utils');

router.use(authentication.authMiddleware);

/* GET Meeting. */
router.get('/', async function(req, res) {
    let statusCode = HttpStatus.OK;
    const name = req.query.name;
    try {
        let meetings = await MongoDb.getMeetings(name);
        return res.status(statusCode).send(getResponseObject(true, statusCode, meetings, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* ADD Meeting. */
router.post('/', async function(req, res) {
    const name = req.body.name;
    const fromTime = req.body.fromTime;
    const toTime = req.body.toTime;
    const description = req.body.description;

    let statusCode = HttpStatus.OK;

    if (!name || !fromTime || !toTime) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, 'Cannot add an invalid meeting.'));
    }

    try {
        await MongoDb.addMeeting(name, req.user.name, fromTime, toTime, description);
        return res.status(statusCode).send(getResponseObject(true, statusCode, {name}, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* DELETE Meeting. */
router.delete('/', async function(req, res) {
    const name = req.body.name;
    const fromTime = req.body.fromTime;
    const toTime = req.body.toTime;
    let statusCode = HttpStatus.OK;

    if (!name || !fromTime || !toTime) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, 'Cannot remove an invalid meeting.'));
    }

    try {
        await MongoDb.delMeeting(name, fromTime, toTime);
        return res.status(statusCode).send(getResponseObject(true, statusCode, null, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

module.exports = router;