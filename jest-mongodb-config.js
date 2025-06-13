module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            skipMD5: true,
        },
        instance: {
            dbName: 'bookapi-test-db',
        },
        autoStart: false,
    },
};