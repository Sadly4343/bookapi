const express = require('express');

const { bookValidationRules, validate } = require('../validation/validation');

const router = express.Router();

const bookController = require('../controllers/books');

const { isAuthenticated } = require('../validation/authenticate');

router.get('/', bookController.getAll);


module.exports = router