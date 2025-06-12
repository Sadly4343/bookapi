const mongodb = require('../data/database');

const getAllAuthors = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const authors = await mongodb
            .getDatabase()
            .db('books')
            .collection('authors')
            .find({})
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch authors'
        });
    }   
};

const getSingleAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const authorId = req.params.id;

        const author = await mongodb
            .getDatabase()
            .db('books')
            .collection('authors')
            .findOne({ _id: authorId });

        if (!author) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Author not found'
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(author);
    } catch (error) {
        console.error('Error fetching author:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch author'
        });
    }   
};

const createAuthor = async(req, res) => {
    //#swagger.tags=['Authors']
    const author = {
        _id: req.body._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        biography: req.body.biography,
        birthdate: req.body.birthdate
    };
    const response = await mongodb.getDatabase().db('books').collection('authors').insertOne(author);
    if (response.acknowledged) {
        res.status(201).send('Author created successfully.');
    } else {
        res.status(500).json(response.error || 'Some error occured while creating the author.');
    }
};

const updateAuthor = async(req, res) => {
    //#swagger.tags=['Authors']
    const authorId = req.params.id;
    const author = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        biography: req.body.biography,
        birthdate: req.body.birthdate
    };
    const response = await mongodb.getDatabase().db('books').collection('authors').replaceOne({ _id: authorId }, author);
    if (response.modifiedCount > 0) {
        res.status(204).end();
    } else {
        res.status(500).json(response.error || 'Some error occured while updating the author.');
    }
};

const deleteAuthor = async(req, res) => {
    //#swagger.tags=['Authors']
    const authorId = req.params.id;
    const response = await mongodb.getDatabase().db('books').collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount > 0) {
        res.status(204).end();
    } else {
        res.status(500).json(response.error || 'Some error occured while deleting the author.');
    }
};

module.exports = { getAllAuthors, getSingleAuthor, createAuthor, updateAuthor, deleteAuthor }