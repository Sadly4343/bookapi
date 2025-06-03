
//User Validation Steps
//const passport = require('passport');
const router = require('express').Router();

//router.use('/');

router.get('/', (req, res) => {
    res.send('hello world')
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));


module.exports = router;