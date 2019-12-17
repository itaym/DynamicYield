const HttpStatus = require('http-status-codes');
const Settings = require('./Settings');
const session = require( 'express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoDb = require('./mongoDb/MongoDb');
const { getResponseObject } = require('./utils');
const MongoStore = require('connect-mongo')(session);
const { sha512 } = require('./utils');

module.exports = class Authentication {
    static init (app) {
        passport.use('local', new LocalStrategy({
                usernameField: 'name',
                passwordField: 'password',
                passReqToCallback: true,
                session: true
            },
            Authentication.doLogin
        ));

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (obj, done) {
            done(null, obj);
        });

        // noinspection SpellCheckingInspection
        app.use(session({
            secret: 'RaNdOmStRiNg',
            saveUninitialized: true,
            resave: true,
            store: new MongoStore({
                url: `${Settings.mongoDb.url}/${Settings.mongoDb.dbName}`,
                collection: 'sessions'
            })
        }));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

        app.use(passport.initialize({}));
        app.use(passport.session({}));
    }

    static async doLogin (req, username, password, done) {
        let error = 'A user with those credentials was not found!';
        let statusCode = HttpStatus.OK;
        let user;

        req.logout();

        if (!username || !password) {
            statusCode = HttpStatus.NOT_FOUND;
            return done(getResponseObject(false, statusCode, null, error), null);
        }

        try {
            user = await MongoDb.getUser(username);

            if (!user) {
                statusCode = HttpStatus.NOT_FOUND;
            }
            else {
                const reCreateHash = sha512( password, user.password.salt);
                if (user.password.hash !== reCreateHash.hash) {
                    statusCode = HttpStatus.NOT_FOUND;
                }
            }
        }
        catch (e) {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            error = e.message;
        }
        if (statusCode === HttpStatus.OK) {
            await MongoDb.setLastLogin(username);
            return done(null, user);
        }
        done(getResponseObject(false, statusCode, null, error), null);
    }

    static authMiddleware (req, res, next) {
        const error = 'Login is required!';
        const statusCode = HttpStatus.UNAUTHORIZED;
        if (!req.isAuthenticated()) {
            res.status(statusCode).send(getResponseObject(false, statusCode, null, error));
            return;
        }
        next();
    }
};