const HttpStatus = require('http-status-codes');
const Settings = require('./Settings');
const session = require( 'express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoDb = require('./MongoDb');
const { getResponseObject } = require('./utils');
const MongoStore = require('connect-mongo')(session);

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

        app.use(cookieParser('RaNdOmStRiNg'));

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

        try {
            user = await MongoDb.getUser(username);

            if (!user) {
                statusCode = HttpStatus.NOT_FOUND;
            }
            else if (user.password !== password) {
                statusCode = HttpStatus.NOT_FOUND;
            }
        }
        catch (e) {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            error = e.message;
        }
        if (statusCode === HttpStatus.OK) {
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