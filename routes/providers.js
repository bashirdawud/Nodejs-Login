const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy

const providers = require('../model/providers')
passport.use(new FacebookStrategy({
        clientID: '********',
        clientSecret: '**********',
        callbackURL: "http://localhost:3000/users/facebook/callback",
        profileFields: ['id', 'name', 'email', 'gender', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(() => {

            providers.findOne({ 'facebook.id': profile.id }, function(err, user) {
                if (err) return done(err);
                if (user)
                    return done(null, user);
                else {
                    const newUser = new providers();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    newUser.save((err) => {
                            if (err) throw err;
                            return done(null, newUser)
                        })
                        // console.log(profile)

                }
            });
        })

    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {

    providers.findById(id, (err, user) => {
        done(err, user);
    });
});

router.get('/facebook',
    passport.authenticate('facebook', { scope: 'email' }));
var options = {
    successRedirect: '/profile',
    failureRedirect: '/login'
};
router.get('/facebook/callback',
    passport.authenticate('facebook', options));

module.exports = router