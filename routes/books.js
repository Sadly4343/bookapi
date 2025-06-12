const express = require('express');

const { bookValidationRules, validate } = require('../validation/validation');

const router = express.Router();

const bookController = require('../controllers/books');

const { isAuthenticated } = require('../validation/authenticate');

router.get('/', bookController.getAll);

router.get('/:id', bookController.getSingle);

router.post('/', isAuthenticated, bookValidationRules(), validate, bookController.createBook);

router.post('/:id', isAuthenticated, bookValidationRules(), validate, bookController.updateBook);

router.delete('/:id', isAuthenticated, bookController.deleteBook);

module.exports = router