const mongoose = require("mongoose");

const ContentCategory = mongoose.Schema({
    id: String,
    name: String,
    userId: String,
    created: Date
})

exports.ContentCategoryDocument = mongoose.model('contentCategory', ContentCategory)
