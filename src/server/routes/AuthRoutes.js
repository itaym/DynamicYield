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
            user && req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.status(HttpStatus.OK).send(getResponseObject(true, HttpStatus.OK, { name: user.name }, null));
            });
        })(req, res, next);
    });

/* Do Logout */
router.get('/logout',
    function(req, res) {
        req.logout();
        res.status(HttpStatus.OK).send(getResponseObject(true, HttpStatus.OK, null, null));
    });

/* Is Logged in */
router.get('/isLoggedIn',
    function (req, res) {
        let statusCode = HttpStatus.OK;
        let error = 'You are not logged in!';

        if (req.isAuthenticated()) {
            res.status(statusCode).send(getResponseObject(true, statusCode, { name: req.user.name }, null));
        }
        else {
            statusCode = HttpStatus.IM_A_TEAPOT;
            res.status(statusCode).send(getResponseObject(true, statusCode, null, error));
        }
    });

module.exports = router;