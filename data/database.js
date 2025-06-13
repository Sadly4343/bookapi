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

    if (!mongoUri) {
        return callback(new Error('MONGODB_URI is not defined'));
    }

    console.log('Connecting to MongoDB...');
    
    mongoClient.connect(mongoUri)
        .then((client) => {
            database = client;
            console.log('MongoDB connected successfully');
            callback(null, database);
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            callback(err);
        });
}

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }

    // For unit testing
    if (globalThis.__MONGO_DB_NAME__) {
        return database.db(globalThis.__MONGO_DB_NAME__);
    }
    
    // For production/development - use default database from connection string
    // or specify a database name via environment variable
    const dbName = process.env.MONGODB_DB_NAME;
    return dbName ? database.db(dbName) : database.db();
}

module.exports = {
    intDb, getDatabase
}
