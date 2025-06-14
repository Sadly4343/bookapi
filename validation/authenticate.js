
 const isAuthenticated = (req, res, next) => {
    if (!req.session.user || !req.user) {
        return res.status(401).json({
            error: "Authentication required",
            message: "Please log in with GitHub to access this resource",
            loginUrl: "/login"
        });
    }
        next();
};

module.exports = { isAuthenticated } 