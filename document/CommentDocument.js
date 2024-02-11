const mongoose = require("mongoose");

const Comment = mongoose.Schema({
    id: String,
    text: String,
    contentId: String,
    userId: String,
    parentId: String,
    created: Date
})

exports.CommentDocument = mongoose.model('comment', Comment)
