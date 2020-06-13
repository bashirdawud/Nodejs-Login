const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth')
const db = mongoose.connection
const ProviderSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
})
const Providers = module.exports = mongoose.model('Provider', ProviderSchema)