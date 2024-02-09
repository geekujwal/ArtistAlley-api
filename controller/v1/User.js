const express = require('express');
const router = express.Router();
const { RequestRegisterToken, CompleteRegistration, Login } = require("../../service/UserService");

router.post("/requestRegistration", RequestRegisterToken);
router.post("/completeRegistration", CompleteRegistration);
router.post("/login", Login);

module.exports = router;
