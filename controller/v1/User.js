const express = require('express');
const router = express.Router();
const { RequestRegisterToken, CompleteRegistration } = require("../../service/UserService");

router.post("/requestRegistration", RequestRegisterToken);
router.post("/completeRegistration", CompleteRegistration);

module.exports = router;