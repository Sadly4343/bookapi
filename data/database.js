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

    const mongoUri = globalThis.__MONGO_URI__ || process.env.MONGODB_URI;

    mongoClient.connect(mongoUri)
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

    if (globalThis.__MONGO_DB_NAME__) {
    return database.db(globalThis.__MONGO_DB_NAME__);
}

    return database.db();
}

module.exports = {
    intDb, getDatabase
}
