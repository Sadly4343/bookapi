
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
            <h1>Welcome to Team 06 CSE341 Class Book API</h1>
            <h2>You are not logged in.</h2>
            <h3>GitHub Login</h3>
            <p>To access the API, please log in with your GitHub account.</p>
            <p>Once logged in, you will be able to access the API endpoints.</p>
            <p>Click the button below to log in:</p>
            <a href="/login" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login with GitHub</a>
            <p>Or, if you are not logged in, you can view the API documentation at <a href="/api-docs">API Documentation</a>.</p>
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