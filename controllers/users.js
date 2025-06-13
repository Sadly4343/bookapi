const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    try {
        //#swagger.tag=['users']
        console.log('Called');
        const result = await mongodb.getDatabase().db().collection('users').find();
        result.toArray().then((users) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving all users"})
    }
};

const getSingleUser = async (req, res) => {
    try {
        //#swagger.tag=['users']
        console.log('Called');
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').find({ '_id': userId});
        result.toArray().then((users) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users[0]);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving a user"})
    }
};

const createUser = async (req, res) => {
    try {
        //#swagger.tag=['users']
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        isbn: req.body.isbn
    }

    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating user');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured users"})
    }
}

const updateUser = async (req, res) => {
    try {
        //#swagger.tag=['users']

    const userId = new ObjectId(req.params.id);
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        isbn: req.body.isbn
    }

    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ '_id': userId}, user);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating user');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured users"})
    }
}

const deleteUser = async (req, res) => {
    try {

    //#swagger.tag=['users']
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ '_id': userId});
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting user');
    }
} catch (err) {
    res.status(500).json({error: err.message || "Error has occured deleting user" })
}
}



module.exports = {
    getAllUsers, getSingleUser, createUser, updateUser, deleteUser
}
   