const { body, validationResult } = require('express-validator')
const authorValidationRules = () => {
    return [
        body('firstName')
            .notEmpty().withMessage('First Name is required')

            .isLength({ min: 2 }).withMessage('First Name must be at least 2 letters long'),
        body('lastName')
            .notEmpty().withMessage('Last Name is required')

            .isLength({ min: 2 }).withMessage('Last Name must be at least 2 letters long'),
        body('biography')
            .notEmpty().withMessage('Biography is a required instance')

            .isLength({ min: 10 }).withMessage('Biography must be at least 10 letters long'),
        body('birthdate')
            .notEmpty().withMessage('Birth Date is required')
            .isISO8601().withMessage('Must be in a valid format for the birth Date EX: 1982-11-11')
    ]
}

const bookValidationRules = () => {
    return [
            body('title')
            .notEmpty().withMessage('Title is required')
            .isLength({ min: 2 }).withMessage('Title must be at least 2 characters long'),
        body('authorId')
            .notEmpty().withMessage('authorId is required')
            .isLength({ min: 7 }).withMessage('authorId must be at least 7 characters long'),
        body('genre')
            .notEmpty().withMessage('Genre is required')
            .isLength({ min: 2 }).withMessage('Genre must be at least 2 characters long'),
        body('pageCount')
            .notEmpty().withMessage('Page Count is required')
            .isInt({ min: 1 }).withMessage('Page Count must be a positive integer and greater than 0'),
        body('publishedDate')
            .notEmpty().withMessage('Published Date is required')
            .isISO8601().withMessage('Must be in a valid format for the published date EX: 1982-11-11'),
        body('isbn')
            .notEmpty().withMessage('ISBN is required')
            .matches(/^[0-9\-Xx]+$/).withMessage('ISBN must be a number, dash, or X only')
            .isLength({ min: 10, max:13 }).withMessage('ISBN must be in valid format between 10-13 numbers long.'),
            
        body('description')
            .notEmpty().withMessage('Description for the book is required.')
            .isLength({ min: 20 }).withMessage('Description must be at least 20 letters long'),
        body('storeIds')
            .notEmpty().withMessage('Store ID is required')
            .isMongoId().withMessage('Store ID must be a valid Mongo ID')
    ]
}

const validate = (req, res, next) => {
    let errors = [];
    errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []

    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg}))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    bookValidationRules,
    authorValidationRules,
    validate
}