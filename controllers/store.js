const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAllStores = async (req, res) => {
    try {
        //#swagger.tag=['store']
        console.log('Called');
        const result = await mongodb.getDatabase().db().collection('stores').find();
        result.toArray().then((store) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(store);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving all Stores"})
    }
};

const getSingleStore = async (req, res) => {
    try {
        //#swagger.tag=['store']
        const storeId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('stores').find({ '_id': storeId });
        result.toArray().then((store) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(store[0]);
        });
    }
    catch (err) {
        res.status(500).json({error: err.message || "Error occured retrieving a Store"})
    }
};

const createStore = async (req, res) => {
    try {
        //#swagger.tag=['store']
    const store = {
        name: req.body.name,
        address: req.body.address,
        website: req.body.website,
        isbn: req.body.isbn
    }

    const response = await mongodb.getDatabase().db().collection('stores').insertOne(store);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating Store');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured in Stores"})
    }
}

const updateStore = async (req, res) => {
    try {
        //#swagger.tag=['store']

    const storeId = new ObjectId(req.params.id);
    const store = {
        name: req.body.name,
        address: req.body.address,
        website: req.body.website,
        isbn: req.body.isbn
    }

    const response = await mongodb.getDatabase().db().collection('stores').replaceOne({ '_id': storeId }, store);

    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Error occured updating Store');
    }
    } 
    catch (err) {
        res.status(500).json({error: err.message || "Error has occured in Stores"})
    }
}

const deleteStore = async (req, res) => {
    try {

    //#swagger.tag=['stores']
    const storeId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('stores').deleteOne({ '_id': storeId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting Store');
    }
} catch (err) {
    res.status(500).json({error: err.message || "Error has occured deleting Store" })
}
}



module.exports = {
    getAllStores, getSingleStore, createStore, updateStore, deleteStore
}