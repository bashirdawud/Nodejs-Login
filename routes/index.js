const express = require('express'),
    router = express.Router();

//HOME PAGE
router.get("/", loggedIn, (req, res) => {
    res.render('index');
});
router.get("/profile", loggedIn, (req, res) => {
    res.render('profile');
});


function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash('error_msg', 'You are not logged in')
        res.redirect('/users/login')
    }

}
module.exports = router