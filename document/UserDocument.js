const mongoose = require("mongoose");

const User = mongoose.Schema({
    id: String,
    username: String,
    name: String,
    email: String,
    password: String,
    avatar: String,
    created: Date
})

exports.UserDocument = mongoose.model('user', User)
