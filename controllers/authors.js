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
            message: 'Faield to fetch authors'
        });
    }

    
};

module.exports = { getAllAuthors }