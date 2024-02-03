const mongoose = require("mongoose");
const { UserType } = require("../contract/UserType");

const User = mongoose.Schema({
    id: String,
    username: String,
    name: String,
    email: String,
    password: String,
    avatar: String,
    type: {
        type: String,
        enum: Object.values(UserType), 
        default: UserType.TEMPORARY
    },
    created: Date
})

exports.UserDocument = mongoose.model('user', User)
