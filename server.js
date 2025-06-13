const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const app = express();

const port = process.env.PORT || 3000;


app.use
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
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
    app.use('/', require('./routes'));

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || 'test-client-id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'test-client-secret',
        callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/github/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
    try {
        const db = mongodb.getDatabase();

        let user = await db.collection('users').findOne({
            githubId: profile.id
        });

        if (!user) {
            user = {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username,
                email: profile.emails?.[0]?.value || null,
                role: 'user', //default role
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await db.collection('users').insertOne(user);
            user._id = result.insertedId;
        }

        profile.dbUser = user;
        profile.role = user.role;

        return done(null, profile);
    } catch (error) {
        return done(error, null);
    }
   
}
));

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user)
});

app.get('/', (req, res) => { 
    if (req.session.user !== undefined) {
        const user = req.session.user;
        const displayName = user.displayName || user.username || user._json?.name || user._json?.login || 'GitHub User';
        res.send(`Logged in as ${displayName}`);
    } else {
        res.send("Logged out");
    }
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'}),
    (req, res) => {
        req.session.user = {
            ...req.user.dbUser,
            githubProfile: {
                username: req.user.username,
                displayName: req.user.displayName
            }
        };
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