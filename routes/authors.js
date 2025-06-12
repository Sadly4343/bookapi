const express = require('express');


const { authorValidationRules, validate } = require('../validation/validation')

const router = express.Router();


const authorsController = require('../controllers/authors');

const { isAuthenticated } = require('../validation/authenticate');

router.get('/', authorsController.getAllAuthors);

router.get('/:id', authorsController.getSingleAuthor);

router.post('/', isAuthenticated, authorValidationRules(), validate, authorsController.createAuthor);

router.put('/:id', isAuthenticated, authorValidationRules(), validate, authorsController.updateAuthor);

router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;