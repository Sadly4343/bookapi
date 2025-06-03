const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        //#swagger.tag=['books']
        console.log('Called');
        const result = await mongodb.getDatabase().db().collection('books').find();
        result.toArray().then((books) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(books);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving all books"})
    }
};

module.exports = {
    getAll
}