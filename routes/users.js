const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy


const User = require('../model/user')
    //REGISTER
router.get("/register", (req, res) => {
    res.render('register');
});

//LOGIN
router.get("/login", (req, res) => {
    res.render('login');
});

// POST NEW
router.post("/register", (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var pwd2 = req.body.pwd2;

    // validation

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('pwd', 'password is required').notEmpty();
    req.checkBody('pwd2', 'password do not match').equals(req.body.pwd);
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        })
    } else {
        // if user exist
        User.findOne({ username: username }, (err, user, done) => {
            if (err) err;
            if (user) {
                //  errors expect objects, so create an error_msg object
                var error_msg = [{ 'msg': 'Username already exist' }]
                res.render('register', {
                    errors: error_msg
                })
            } else {
                // save user to db
                var newUser = new User({
                    email: email,
                    name: name,
                    username: username,
                    pwd: pwd
                })
                User.createUser(newUser, (err, user) => {
                    if (err) throw err;
                    console.log(user)
                });
                req.flash('success_msg', 'You are registered and can now login')
                res.redirect('/users/login')

            }
        });

    }
});
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'pwd'
    },
    function(username, password, done) {
        console.log(username)
        User.getUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'unknown user' });
            } else {
                User.comparePassword(password, user.pwd, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid password' })
                    }

                })
            }

        });
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    (req, res) => {
        res.redirect('/profile')
    });


router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login');
});

module.exports = router