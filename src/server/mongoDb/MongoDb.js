const { dateFromObjectId, genRandomString, sha512 } = require('../utils');
const { MongoClient } = require('mongodb');
// noinspection JSUnresolvedVariable
const ObjectID = require('mongodb').ObjectID;
const Settings = require('../Settings');
const schemas = require('./MongoSchemas');

//methods symbols
const _connect = Symbol('_connect');
const _getUser = Symbol('_getUser');
const _getUsers = Symbol('_getUsers');
const _addUser = Symbol('_addUser');
const _delUser = Symbol('_delUser');
const _setLastLogin = Symbol('_setLastLogin');
const _createDefaultUser = Symbol('_createDefaultUser');

const _getRoom = Symbol('_getRoom');
const _getRooms = Symbol('_getRooms');
const _addRoom = Symbol('_addRoom');
const _delRoom = Symbol('_delRoom');

const _getMeetings = Symbol('_getMeetings');
const _addMeeting = Symbol('_addMeeting');
const _insertMeeting = Symbol('_insertMeeting');
const _delMeeting = Symbol('_delMeeting');

//props symbols
const _client = Symbol('_client');
const _db = Symbol('_db');

//Other
const _meetingsName = Symbol('_meetingsName');
const _createCollections = Symbol('_create_collections');

class MongoDb {
    [_meetingsName] (name) {
        return `meetings_of_${name.replace(/ /g, '_')}`;
    }

    async [_connect] () {
        // noinspection JSCheckFunctionSignatures
        this[_client] = await MongoClient.connect(Settings.mongoDb.url, { useUnifiedTopology: true });
        this[_db] = await this[_client].db(Settings.mongoDb.dbName);

        await this[_createCollections]();

        return this[_db];
    }

    async [_createCollections] () {
        const collections = [...await this[_db].listCollections().toArray()];
        const colsNames = collections.map((element) => element.name);
        const NOT_FOUND = -1;

        if (colsNames.indexOf('users') === NOT_FOUND) {
            await this.db.createCollection('users', schemas.users);
        }
        if (colsNames.indexOf('rooms') === NOT_FOUND) {
            await this.db.createCollection('rooms', schemas.rooms);
        }
    }

    async [_getUser] (name = Math.random() + '') {
        return await this.db.collection('users').findOne({name});
    }

    async [_getUsers] () {
        let users = await this.db.collection('users').find({}).toArray();
        users = [...users].map((element) => ({
            _id: element._id,
            name: element.name,
            created: dateFromObjectId(element._id.toString()),
            lastLogin: element.lastLogin
        }));
        return users;
    }

    async [_addUser] (name, password) {
        const user = await this.getUser(name);
        if (user) {
            throw {message: 'User already exists'};
        }
        const salt = genRandomString(16);
        const passObject = sha512( password, salt);
        return await this.db.collection('users').insertOne({name, password: passObject});
    }

    async [_delUser] (name) {
        const rooms = await this.getRooms();

        for (const room of rooms) {
            let meetingsName = this[_meetingsName](room.name);
            let allMeetings = await this.db.collection(meetingsName).find({owner: name}).toArray();
            allMeetings = [...allMeetings];
            for (const meeting of allMeetings) {
                await this.delMeeting(room.name, meeting.fromTime, meeting.toTime);
            }
        }
        await this.db.collection('users').deleteOne({name});
    }

    async [_setLastLogin] (name) {
        const user = await this.getUser(name);

        if (!user) {
            throw {message: 'User was not found'};
        }
        await this.db.collection('users').updateOne({_id: user._id}, {$set: {lastLogin: new Date()}});
    }

    async [_createDefaultUser] () {
        const collectionUsers = await this.db.collection('users');
        const users = await collectionUsers.find({}).toArray();

        if (users.length === 0) {
            await this.addUser(Settings.defaultUser.name, Settings.defaultUser.password);
        }
    }

    async [_getRoom] (name = Math.random() + '') {
        return await this.db.collection('rooms').findOne({name});
    }

    async [_getRooms] () {
        let rooms = await this.db.collection('rooms').find({}).toArray();
        rooms = [...rooms].map((element) => {
            element.created = dateFromObjectId(element._id.toString());
            return element
        });
        return rooms;
    }

    async [_delRoom] (name) {
        const meetingsName = this[_meetingsName](name);
        await this.db.collection(meetingsName).drop();
        await this.db.collection('rooms').deleteOne({name});
    }

    async [_addRoom] (name) {
        const room = await this.getRoom(name);
        if (room) {
            throw {message: 'Room already exists'};
        }
        const meetingsName = this[_meetingsName](name);
        await this.db.collection('rooms').insertOne({name});
        await this.db.createCollection(meetingsName, schemas.meeting_of_);
    }

    async [_insertMeeting] (meetingName, meeting, previous, successive) {
        meeting._id = new ObjectID();

        if (previous) {
            meeting.previous = previous._id;
            await this.db.collection(meetingName).updateOne({_id: previous._id}, {$set: {successive: meeting._id}});
        }
        if (successive) {
            meeting.successive = successive._id;
            await this.db.collection(meetingName).updateOne({_id: successive._id}, {$set: {previous: meeting._id}});
        }
        await this.db.collection(meetingName).insertOne(meeting);
    }

    async [_addMeeting] (roomName, userName, fromTime, toTime, description) {
        const error = 'The room is already occupied!';
        const meetingsName = this[_meetingsName](roomName);
        const collection = this.db.collection(meetingsName);
        let similar, previousMeeting, successiveMeeting;
        const newMeeting = {
            owner: userName,
            fromTime: new Date(fromTime),
            toTime: new Date(toTime),
            description
        };
        //Check if similar meeting exists:
        similar = await collection.findOne({fromTime: newMeeting.fromTime, toTime: newMeeting.toTime});
        if (similar) {
            throw {message: error}
        }
        //get one where its toTime is smaller from fromTime
        previousMeeting = [...await collection.find({toTime: { $lt: newMeeting.fromTime}})
            .sort({toTime: -1})
            .limit(1).toArray()][0];
        if (previousMeeting) {
            //Previous was found. Check if it has successive meeting
            // noinspection JSUnresolvedVariable
            if (previousMeeting.successive) {
                successiveMeeting = await collection.findOne({_id: previousMeeting.successive});
                //Can the meeting fit between
                if (successiveMeeting.fromTime > newMeeting.toTime) {
                    //Insert between
                    this[_insertMeeting](meetingsName, newMeeting, previousMeeting, successiveMeeting);
                }
                else {
                    throw {message: error}
                }
            }
            else {
                //There isn't any other meeting after that so insert after
                this[_insertMeeting](meetingsName, newMeeting, previousMeeting, null);
            }
        }
        else {
            //The same story just the other way around
            //get one where its fromTime is bigger from toTime
            successiveMeeting = [...await collection
                .find({fromTime: { $gte:newMeeting.toTime}})
                .sort({fromTime: 1})
                .limit(1).toArray()][0];
            if (successiveMeeting) {
                //Successive was found. Check if it has previous meeting
                // noinspection JSUnresolvedVariable
                if (successiveMeeting.previous) {
                    previousMeeting = await collection.findOne({_id: successiveMeeting.previous});
                    //Can the meeting can fit between
                    if (previousMeeting.toTime < newMeeting.fromTime) {
                        this[_insertMeeting](meetingsName, newMeeting, previousMeeting, successiveMeeting);
                    }
                    else {
                        throw {message: error}
                    }
                }
                else {
                    //There isn't any other meeting before that so insert before
                    this[_insertMeeting](meetingsName, newMeeting, null, successiveMeeting);
                }
            }
            else {
                //if this is the first meeting for the room
                let count = await collection.count();
                if (count === 0) {
                    //insertMeeting
                    this[_insertMeeting](meetingsName, newMeeting, null, null);
                }
                else {
                    throw {message: error}
                }
            }
        }
    }

    async [_delMeeting] (roomName, fromTime, toTime) {
        const error = 'Meeting was not found!';
        const meetingsName = this[_meetingsName](roomName);
        const collection = this.db.collection(meetingsName);
        const meeting = await collection.findOne({fromTime: new Date(fromTime), toTime: new Date(toTime)});

        if (meeting) {
            if (meeting.previous && meeting.successive) {
                await this.db.collection(meetingsName).updateOne({_id: meeting.previous}, {$set: {successive: meeting.successive}});
                await this.db.collection(meetingsName).updateOne({_id: meeting.successive}, {$set: {previous: meeting.previous}});
            }
            else if (meeting.successive) {
                await this.db.collection(meetingsName).updateOne({_id: meeting.successive}, {$set: {previous: null}});
            }
            else if (meeting.previous) {
                await this.db.collection(meetingsName).updateOne({_id: meeting.previous}, {$set: {successive: null}});
            }
            await this.db.collection(meetingsName).deleteOne({_id: meeting._id});
        }
        else {
            throw { message: error };
        }
    }

    async [_getMeetings] (name) {
        const meetingsName = this[_meetingsName](name);
        return await this.db.collection(meetingsName).find({}).sort({"fromTime":1}).toArray();
    }

    async connect () {
        return await this[_connect]();
    }

    async addUser (name, password) {
        return await this[_addUser](name, password);
    }

    async delUser (name) {
        return await this[_delUser](name);
    }

    async getUser (name) {
        return await this[_getUser](name);
    }

    async getUsers () {
        return await this[_getUsers]();
    }

    async setLastLogin (name) {
        return await this[_setLastLogin](name);
    }
    async createDefaultUser () {
        this[_createDefaultUser]();
    }

    async addRoom (name) {
        return await this[_addRoom](name);
    }

    async delRoom (name) {
        return await this[_delRoom](name);
    }

    async getRoom (name) {
        return await this[_getRoom](name);
    }

    async getRooms () {
        return await this[_getRooms]();
    }
    async addMeeting (roomName, userName, fromTime, toTime, description) {
        return await this[_addMeeting](roomName, userName, fromTime, toTime, description);
    }

    async delMeeting (name, fromTime, toTime) {
        return await this[_delMeeting](name, fromTime, toTime);
    }

    async getMeetings (name) {
        return await this[_getMeetings](name);
    }

    get db () {
        return this[_db];
    }
}
module.exports = new MongoDb();