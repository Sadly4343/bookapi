
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //res.send('hello world')
     if (req.isAuthenticated()) {
        res.send(`
            <h1>Welcome ${req.user.displayName}!</h1>
            <h3>Profile URL: ${req.user.profileUrl}</h3>
            <p>You are logged in via GitHub</p><br>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome to Team six Book API</h1>
            <p>You are not logged in</p>
            <a href="/login">Login with GitHub</a>
        `);
    }
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/users', require('./users'));
router.use('/stores', require('./store'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err);}
        res.redirect('/')
    })
})


module.exports = router;