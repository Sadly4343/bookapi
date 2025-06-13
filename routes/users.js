const express = require('express');
const { usersValidationRules, validate } = require('../validation/validation')
const router = express.Router();
const usersController = require('../controllers/users');

const { isAuthenticated } = require('../validation/authenticate');

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getSingleUser);

router.post('/', isAuthenticated, usersValidationRules(), validate, usersController.createUser);

router.put('/:id', isAuthenticated, usersValidationRules(), validate, usersController.updateUser);

router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;