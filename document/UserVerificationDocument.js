const mongoose = require("mongoose");

const userVerification = mongoose.Schema({
    id: String,
    email: String,
    lastAttemptAt: Date,
    totalAttemps: Number,
    token: [{
        token: String,
        createdAt: Date
    }],
    created: Date
})

exports.UserVerificationDocument = mongoose.model('userVerification', userVerification)
