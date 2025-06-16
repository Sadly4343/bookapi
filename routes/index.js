
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();
const { isAuthenticated } = require('../validation/authenticate');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err);}
        res.redirect('/')
    })
}); 

router.use('/api-docs', isAuthenticated);

router.use('/', require('./swagger'));

router.use('/books', require('./books'));
router.use('/authors', isAuthenticated, require('./authors'));
router.use('/users', isAuthenticated, require('./users'));
router.use('/store', require('./store'));

module.exports = router;