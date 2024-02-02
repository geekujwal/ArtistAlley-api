const express = require('express');
const router = express.Router();
const { RequestRegisterToken } = require("../../service/UserService");

router.post("/", RequestRegisterToken);

module.exports = router;