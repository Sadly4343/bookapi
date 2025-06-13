const express = require('express');
const { storesValidationRules, validate } = require('../validation/validation');
const router = express.Router();
const storesController = require('../controllers/store');
const { isAuthenticated } = require('../validation/authenticate');


router.get('/', storesController.getAllStores);

router.get('/:id', storesController.getSingleStore);

router.post('/', isAuthenticated, storesValidationRules(), validate, storesController.createStore);

router.put('/:id', isAuthenticated, storesValidationRules(), validate, storesController.updateStore);

router.delete('/:id', isAuthenticated, storesController.deleteStore);

module.exports = router;
