const express = require('express');
const router = express.Router();
const { AddNewComment, DeleteComment } = require("../../service/CommentService");
const { userAuth } = require('../../middleware/authentication');

router.post("/:contentId", userAuth, AddNewComment);
router.delete("/:id", userAuth, DeleteComment);

module.exports = router;
