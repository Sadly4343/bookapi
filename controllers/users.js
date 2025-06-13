const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    try {
        //#swagger.tag=['users']
        console.log('Called');
        const result = await mongodb.getDatabase().db().collection('users').find();
        result.toArray().then((user) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(user);
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
        const result = await mongodb.getDatabase().db().collection('users').findOne({ '_id': userId});
         if (!result) {
            return res.status(404).json({error: "User not found"});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
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

    if (response.acknowledged > 0) {
        return res.status(201).json(user).message || 'User created successfully';
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

    if (response.modifiedCount > 0) {
        return res.status(200).json(user).message || 'User updated successfully';
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
        return res.status(200).json({ message: 'User deleted successfully' });
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
   