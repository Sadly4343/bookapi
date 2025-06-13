const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllUsers = async (req, res) => {
    try {
        //#swagger.tag=['users']
        console.log('Called');
        const users = await mongodb.getDatabase().collection('users').find().toArray(); 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({error: err.message || "Error occured retrieving all users"})
    }
};

const getSingleUser = async (req, res) => {
    try {
        //#swagger.tag=['users']
        console.log('Called');
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({error: "Invalid user ID format"});
        }
        
        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDatabase().collection('users').findOne({ '_id': userId}); 
        
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        
        // Remove password from response for security
        const { password, ...userWithoutPassword } = user;
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(userWithoutPassword);
    }
    catch (err) {
        console.error('Error fetching user:', err);
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
            role: req.body.role
        }

        const response = await mongodb.getDatabase().collection('users').insertOne(user); 

        if (response.acknowledged) { 
            return res.status(201).json({ message: 'User created successfully' }); 
        } else {
            res.status(500).json({error: 'Error occured creating user'}); 
        }
    } 
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({error: err.message || "Error has occured creating user"})
    }
}

const updateUser = async (req, res) => {
    try {
        //#swagger.tag=['users']
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({error: "Invalid user ID format"});
        }

        const userId = new ObjectId(req.params.id);
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }

        const response = await mongodb.getDatabase().collection('users').replaceOne({ '_id': userId}, user); // Fixed: removed .db()

        if (response.modifiedCount > 0) {
            return res.status(200).json({ message: 'User updated successfully' }); 
        } else if (response.matchedCount === 0) {
            return res.status(404).json({error: "User not found"}); 
        } else {
            res.status(500).json({error: 'Error occured updating user'});
        }
    } 
    catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({error: err.message || "Error has occured updating user"})
    }
}

const deleteUser = async (req, res) => {
    try {
        //#swagger.tag=['users']
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({error: "Invalid user ID format"});
        }
        
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().collection('users').deleteOne({ '_id': userId}); // Fixed: removed .db()
        
        if (response.deletedCount > 0) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({error: "User not found"}); 
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({error: err.message || "Error has occured deleting user" })
    }
}

module.exports = {
    getAllUsers, getSingleUser, createUser, updateUser, deleteUser
}