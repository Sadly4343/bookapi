
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('hello world')
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/users', require('./users'));
router.use('/store', require('./store'));



router.get('/login', passport.authenticate('github', { scope: ['user:user'] }));


 router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err);}
        res.redirect('/')
    })
}) 


module.exports = router;