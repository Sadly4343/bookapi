
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();
const { isAuthenticated } = require('../validation/authenticate');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    const sessionId = req.sessionID;
    console.log('Logging out session:', sessionId);

    req.logout(function(err) {
        if (err) { 
            console.error('Passport logout error:', err);
            return next(err);}

        req.session.user = null;

        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return next(err);
            }

            res.clearCookie('sessionId');

            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            console.log('Session destroyed, redirecting to home');
            res.redirect('/');
        });     
    });
}); 

router.use('/api-docs', isAuthenticated);

router.use('/', require('./swagger'));

router.use('/books', require('./books'));
router.use('/authors', isAuthenticated, require('./authors'));
router.use('/users', isAuthenticated, require('./users'));
router.use('/store', require('./store'));

module.exports = router;