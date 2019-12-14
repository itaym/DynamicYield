const { dateFromObjectId } = require('./utils');

const { MongoClient } = require('mongodb');
// noinspection JSUnresolvedVariable
//const ObjectID = require('mongodb').ObjectID;
const Settings = require('./Settings');

//methods symbols
const _connect = Symbol('_connect');
const _getUser = Symbol('_getUser');
const _getUsers = Symbol('_getUsers');
const _addUser = Symbol('_addUser');
const _delUser = Symbol('_delUser');
const _createDefaultUser = Symbol('_createDefaultUser');

//props symbols
const _client = Symbol('_client');
const _db = Symbol('_db');

class MongoDb {

    async [_connect] () {
        // noinspection JSCheckFunctionSignatures
        this[_client] = await MongoClient.connect(Settings.mongoDb.url, { useUnifiedTopology: true });
        this[_db] = await this[_client].db(Settings.mongoDb.dbName);

        return this[_db];
    }

    async [_getUser] (name = Math.random() + '') {
        return await this.db.collection('users').findOne({name});
    }

    async [_getUsers] () {
        let users = await this.db.collection('users').find({}).toArray();
        users = [...users].map((element) => ({_id: element._id, name: element.name, created: dateFromObjectId(element._id.toString())}));
        return users;
    }

    async [_addUser] (name, password) {
        const user = await this.getUser(name);
        if (user) {
            throw {message: 'User already exists'};
        }
        return await this.db.collection('users').insert({name, password});
    }

    async [_delUser] (name) {
        //todo: remove user conference rooms schedule
        await this.db.collection('users').deleteOne({name});
    }

    async [_createDefaultUser] () {
        const collectionUsers = await this.db.collection('users');
        const users = await collectionUsers.find({}).toArray();

        if (users.length === 0) {
            await collectionUsers.insert({
                name: Settings.defaultUser.name,
                password: Settings.defaultUser.password
            });
        }
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

    async createDefaultUser () {
        this[_createDefaultUser]();
    }

    get db () {
        return this[_db];
    }
}
module.exports = new MongoDb();