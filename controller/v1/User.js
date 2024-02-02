const express = require('express');
const router = express.Router();
const { RequestRegisterToken } = require("../../service/UserService");

router.get("/", RequestRegisterToken);

module.exports = router;