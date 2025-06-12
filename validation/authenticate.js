const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("No access sorry")    }
        next();
}

module.exports = { isAuthenticated }