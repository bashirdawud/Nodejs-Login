const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: { unique: true }
    },
    name: {
        type: String


    },
    email: {
        type: String,
        unique: true

    },
    pwd: {
        type: String

    }
});


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.pwd, salt, function(err, hash) {
            newUser.pwd = hash;
            newUser.save(callback)
        });
    });
}
module.exports.getUsername = (username, callback) => {
    const query = { username: username };
    User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback)
}
module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {

        if (err) throw err;
        callback(null, isMatch)
    })
}