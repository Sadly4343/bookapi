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

const getSingle = async (req, res) => {
    try {
        //#swagger.tag=['books']
        console.log('Called');
        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('books').find({ _id: bookId});
        result.toArray().then((books) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(books[0]);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving a book"})
    }
};

const createBook = async (req, res) => {
    try {
        //#swagger.tag=['books']
    const book = {
        title: req.body.title,
        authorId: req.body.authorId,
        genre: req.body.genre,
        pageCount: req.body.pageCount,
        publishedDate: req.body.publishedDate,
        isbn: req.body.isbn,
        description: req.body.description,
        storeIds: req.body.storeIds

    
    }

    const response = await mongodb.getDatabase().db().collection('books').insertOne(book);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating book');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured books"})
    }
}

const updateBook = async (req, res) => {
    try {
        //#swagger.tag=['books']

    const bookId = new ObjectId(req.params.id);
    const book = {
        title: req.body.title,
        authorId: req.body.authorId,
        genre: req.body.genre,
        pageCount: req.body.pageCount,
        publishedDate: req.body.publishedDate,
        isbn: req.body.isbn,
        description: req.body.description,
        storeIds: req.body.storeIds

    
    }

    const response = await mongodb.getDatabase().db().collection('books').replaceOne({ _id: bookId}, book);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating book');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured books"})
    }
}

const deleteBook = async (req, res) => {
    try {

    
    //#swagger.tag=['books']
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting car');
    }
} catch (err) {
    res.status(500).json({error: err.message || "Error has occured deleting car" })
}
}



module.exports = {
    getAll, getSingle, createBook, updateBook, deleteBook
}