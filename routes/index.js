
//User Validation Steps
const passport = require('passport');
const router = require('express').Router();
const { isAuthenticated } = require('../validation/authenticate');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    console.log('Logout initiated');
    console.log('Current cookies:', req.headers.cookie);
    console.log('Session user before logout:', req.session.user);
    
    req.logout(function(err) {
        if (err) {
            console.error('Passport logout error:', err);
            return next(err);
        }
        
        console.log('Passport logout successful');
        
        req.session.user = null;
        console.log('Session user cleared');
        
        res.clearCookie('connect.sid');
        res.clearCookie('sessionId');
        console.log('Cookies cleared');
        
        if (req.headers.cookie) {
            req.headers.cookie.split(';').forEach(cookie => {
                const cookieName = cookie.split('=')[0].trim();
                res.clearCookie(cookieName);
                console.log('Cleared cookie:', cookieName);
            });
        }
        
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return next(err);
            }
            
            console.log('Session destroyed');
            
            res.send(`
                <script>
                    console.log('Client-side logout cleanup started');
                    
                    // Clear any localStorage/sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Clear all cookies from client side as well
                    document.cookie.split(";").forEach(function(c) { 
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                    });
                    
                    console.log('Client-side cleanup complete, redirecting...');
                    
                    // Force redirect after clearing storage
                    setTimeout(function() {
                        window.location.replace('/');
                    }, 100);
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