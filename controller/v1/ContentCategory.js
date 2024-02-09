const express = require('express');
const router = express.Router();
const { AddNewContentCategory, DeleteContentCategory } = require("../../service/ContentCategoryService");
const { moderatorAuth } = require('../../middleware/authentication');

router.post("/createNewCategory", moderatorAuth, AddNewContentCategory);
router.delete("/deleteCategories", DeleteContentCategory);

module.exports = router;
