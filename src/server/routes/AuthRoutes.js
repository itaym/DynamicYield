const express = require('express');
const router = express.Router();
const passport = require('passport');
const HttpStatus = require('http-status-codes');
const { getResponseObject } = require('../utils');

/* Do Login */
router.post('/login',
    function(req, res, next) {
        passport.authenticate('local', {}, function (err, user) {
            if (err) {
                return res.status(err.statusCode).send(err);
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.status(HttpStatus.OK).send(getResponseObject(true, HttpStatus.OK, { name: user.name }, null));
            });
        })(req, res, next);
    });

router.get('/logout',
    function(req, res) {
        req.logout();
        res.status(HttpStatus.OK).send(getResponseObject(true, HttpStatus.OK, null, null));
    });

module.exports = router;