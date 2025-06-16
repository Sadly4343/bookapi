
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();
const { isAuthenticated } = require('../validation/authenticate');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    const sessionId = req.sessionID;
    console.log('Logging out session:', sessionId);

    req.logout(function(err) {
        if (err) return next(err);
        
        req.session.user = null;
        
        Object.keys(req.cookies || {}).forEach(cookieName => {
            res.clearCookie(cookieName);
        });
        
        req.session.destroy((err) => {
            if (err) return next(err);
            
            res.send(`
                <script>
                    // Clear any localStorage/sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Force redirect after clearing storage
                    window.location.href = '/';
                </script>
            `);
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