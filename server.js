const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

 app.use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        name: 'connct.sid',
        cookie:  {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
         res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

    .use(cors({methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: '*'}))
    .use('/', require('./routes'));

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || 'test-client-id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'test-client-secret',
        callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user)
});

app.get('/', (req, res) => { 
    if (req.session.user) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        max-width: 800px; 
                        margin: 50px auto; 
                        padding: 20px;
                        text-align: center;
                    }
                    .nav-links { margin: 30px 0; }
                    .nav-links a { 
                        display: inline-block;
                        margin: 10px 15px; 
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .nav-links a:hover { background-color: #0056b3; }
                    .logout { background-color: #dc3545 !important; }
                    .logout:hover { background-color: #c82333 !important; }
                </style>
            </head>
            <body>
                <h1>Welcome, ${req.session.user.displayName}!</h1>
                <p>You are successfully logged in.</p>
                
                <div class="nav-links">
                    <a href="/api-docs">View API Documentation</a>
                    <a href="/logout" class="logout">Logout</a>
                </div>
            </body>
            </html>
        `);
    // } else {
    //     res.redirect('/login');
    // }
    } else {
        // Instead of redirecting to /login, show a test page
        res.send(`
            <h1>Logged Out Successfully!</h1>
            <p>Session cleared. You would normally be redirected to GitHub login.</p>
            <a href="/login">Click here to log in again</a>
        `);
    }

});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        mongodb.intDb((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


// This will only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            app.listen(port, () => {
                console.log(`Running on port ${port}`)
            });
        })
        .catch((err) => {
            console.log(err);
        });
} else {
    //For testing, initialize database when app is imported
    initializeDatabase().catch(console.error);
}

module.exports = app;