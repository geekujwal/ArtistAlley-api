const express = require('express');
const router = express.Router();
const { HealthPing } = require("../../service/HealthService");

router.get("/", HealthPing);

module.exports = router;