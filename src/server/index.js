const express = require('express');
// noinspection SpellCheckingInspection
const procexss = require('node-procexss');
const MongoDb = require('./mongoDb/MongoDb');
const logger = require('./logger');
const authRouter = require('./routes/AuthRoutes');
const usersRouter = require('./routes/UserRoutes');
const roomsRouter = require('./routes/RoomRoutes');
const meetingsRouter = require('./routes/MeetingRoutes');
const authentication = require('./Authentication');

const app = express();

(async function() {
    try {
        await MongoDb.connect();
        await MongoDb.createDefaultUser();

        authentication.init(app);

        app.use(logger);
        app.use(express.static('dist'));
        app.use(express.static(__dirname + '/../../public'));
        app.use(procexss());

        app.use('/', authRouter);
        app.use('/users', usersRouter);
        app.use('/rooms', roomsRouter);
        app.use('/meetings', meetingsRouter);

        app.use('/*', function (req, res) {
            res.redirect('/');
        });

        app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}!`));
    }
    catch (e) {
        throw e;
    }
})()
    .then(() => {
        console.log('Everything should be kicking...');
    })
    .catch((e) => {
        console.log(`This is not a good end...\n${e.message}`);
    });