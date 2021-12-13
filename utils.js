exports.checkAuthentication = (req, res, next) => {
    req.isAuthenticated() ? next() : res.json({
        status: 401,
        success: false,
        type: 'error',
        message: 'You are not authorized to perform this action !'
    });
}