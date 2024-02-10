const mongoose = require("mongoose");

const Content = mongoose.Schema({
    id: String,
    title: String,
    userId: String,
    created: Date
})

exports.ContentDocument = mongoose.model('content', Content)
