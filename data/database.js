const dotenv = require('dotenv');
const { CancellationToken } = require('mongodb');

dotenv.config();

const mongoClient = require('mongodb').MongoClient;

let database;

const intDb = (callback) => {
    if (database) {
        console.log('Db is already init');
        return callback(null, database);
    }
    mongoClient.connect(process.env.MONGODB_URI)
        .then((client) => {
            database = client;
            callback(null, database);

        })
        .catch((err) => {
            callback(err);
        })
}

const getDatabase = () => {
    if (!database) {
        throw Error('database not found')
    }
    return database;
}

module.exports = {
    intDb, getDatabase
}
