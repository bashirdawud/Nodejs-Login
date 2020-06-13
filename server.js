const express = require('express'),
    path = require('path'),
    bParser = require('body-parser'),
    cParser = require('cookie-parser'),
    handle = require('express-handlebars'),
    valid = require('express-validator'),
    sess = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    localS = require('passport-local').Strategy,
    facebook = require('passport-facebook'),
    mongo = require('mongodb'),
    mongooose = require('mongoose')

//connect mongoose
mongooose.connect('mongodb://localhost/auth')
const db = mongooose.connection

//routes
const routes = require('./routes/index'),
    users = require('./routes/users'),
    auth = require('./routes/providers'),
    app = express();

//view  
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', handle({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

//middleware
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use(cParser());

//static files
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(sess({
    secret: "iknowyoursecret",
    saveUninitialized: true,
    resave: true
}));

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

//validator
app.use(valid({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// connect flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
});

app.use("/", routes)
app.use("/users", users);
app.use("/users", auth);

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), () => {
    console.log("listening on port " + app.get('port'))
})