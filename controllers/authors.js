const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllAuthors = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const authors = await mongodb
            .getDatabase()
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

        if (!ObjectId.isValid(authorId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid author ID format'
            });
        }
        
        const author = await mongodb
            .getDatabase()
            .collection('authors')
            .findOne({ _id: new ObjectId(authorId) });
            
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

const createAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const author = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            biography: req.body.biography,
            birthdate: req.body.birthdate
        };

        const response = await mongodb.getDatabase().collection('authors').insertOne(author);
        
        if (response.acknowledged) {
            res.status(201).json({ message: 'Author created successfully.' });
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the author.' });
        }
    } catch (error) {
        console.error('Error creating author:', error);
        res.status(500).json({ error: 'Some error occurred while creating the author.' });
    }
};

const updateAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const authorId = req.params.id;
        const author = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            biography: req.body.biography,
            birthdate: req.body.birthdate
        };

        const response = await mongodb
            .getDatabase()
            .collection('authors')
            .replaceOne({ _id: new ObjectId(authorId) }, author);

        if (response.modifiedCount > 0) {
            res.status(204).end();
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the author.' });
        }
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({ error: 'Some error occurred while updating the author.' });
    }
};

const deleteAuthor = async (req, res) => {
    //#swagger.tags=['Authors']
    try {
        const authorId = req.params.id;
        const response = await mongodb
            .getDatabase()
            .collection('authors')
            .deleteOne({ _id: new ObjectId(authorId) });

        if (response.deletedCount > 0) {
            res.status(204).end();
        } else {
            res.status(500).json({ error: 'Some error occurred while deleting the author.' });
        }
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({ error: 'Some error occurred while deleting the author.' });
    }
};

module.exports = { getAllAuthors, getSingleAuthor, createAuthor, updateAuthor, deleteAuthor };