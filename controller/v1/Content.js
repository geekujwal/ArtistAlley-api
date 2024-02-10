const express = require('express');
const router = express.Router();
const { AddNewContent, DeleteContent } = require("../../service/ContentService");
const { contentCreatorAuth } = require('../../middleware/authentication');

router.post("/", contentCreatorAuth, AddNewContent);
router.delete("/:id", contentCreatorAuth, DeleteContent);

module.exports = router;
