const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        //#swagger.tag=['books']
        console.log('Called');
        const result = await mongodb.getDatabase().collection('books').find();
        result.toArray().then((book) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(book);
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
        
        // Add ObjectId validation
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({error: "Invalid book ID format"});
        }
        
        const bookId = new ObjectId(req.params.id);
        const book = await mongodb.getDatabase().collection('books').findOne({ '_id': bookId });
        
        // Check if book exists - this is where you need the 404
        if (!book) {
            return res.status(404).json({error: "Book not found"});
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(book);
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

    const response = await mongodb.getDatabase().collection('books').insertOne(book);

    if (response.acknowledged) {
    return res.status(201).json({ message: 'Book created successfully' }); 
    } else {
    res.status(500).json(response.error || 'Error occured creating book');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error occured creating books"})
    }
}

const updateBook = async (req, res) => {
    try {
        //#swagger.tag=['books']
    let bookId;
        try {
            bookId = new ObjectId(req.params.id);
        } catch (idError) {
            return res.status(400).json({error: "Invalid book ID format"})
        } 
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

    const response = await mongodb.getDatabase().collection('books').replaceOne({ '_id': bookId}, book);

    if (response.modifiedCount > 0) {
    return res.status(200).json({ message: 'Book updated successfully' }); // Fixed syntax
} else if (response.matchedCount === 0) {
    return res.status(404).json({error: "Book not found"}); // Add 404 for non-existent books
} else {
    res.status(500).json(response.error || 'Error occured updating book');
}
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured updating books"})
    }
}

const deleteBook = async (req, res) => {
    try {   
    //#swagger.tag=['books']
    let bookId;
        try {
            bookId = new ObjectId(req.params.id);
        } catch (idError) {
            return res.status(400).json({error: "Invalid book ID format"});
        }
    const response = await mongodb.getDatabase().collection('books').deleteOne({ '_id': bookId });
    if (response.deletedCount > 0) {
    return res.status(200).json({ message: 'Book deleted successfully' });
    } else {
    return res.status(404).json({error: "Book not found"}); // Changed from 500 to 404
    }
} catch (err) {
    res.status(500).json({error: err.message || "Error has occured deleting book" })
}
}



module.exports = {
    getAll, getSingle, createBook, updateBook, deleteBook
}