const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const MongoDb = require('../MongoDb');
const Settings = require('../Settings');
const authentication = require('../Authentication');
const { getResponseObject } = require('../utils');

router.use(authentication.authMiddleware);

/* GET users. */
router.get('/', async function(req, res) {
    let statusCode = HttpStatus.OK;
    try {
        let users = await MongoDb.getUsers();
        return res.status(statusCode).send(getResponseObject(true, statusCode, users, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* ADD user. */
router.post('/', async function(req, res) {
    const name = req.body.name;
    const password = req.body.password;
    let statusCode = HttpStatus.OK;

    if (!name || !password) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, 'Cannot add an invalid user.'));
    }

    try {
        await MongoDb.addUser(name, password);
        return res.status(statusCode).send(getResponseObject(true, statusCode, {name}, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

/* DELETE user. */
router.delete('/', async function(req, res) {
    const name = req.body.name;
    let statusCode = HttpStatus.OK;

    if (req.user.name === name) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, 'A User cannot remove himself!'));
    }
    if (name === Settings.defaultUser.name) {
        statusCode = HttpStatus.FORBIDDEN;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, `${Settings.defaultUser.name} cannot be removed!`));
    }

    try {
        await MongoDb.delUser(name);
        return res.status(statusCode).send(getResponseObject(true, statusCode, {name}, null));
    }
    catch (e) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(getResponseObject(false, statusCode, null, e.message));
    }
});

module.exports = router;