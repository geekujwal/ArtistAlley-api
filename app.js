const express = require("express");
const { connectDb } = require("./utils/db");
require('dotenv').config()

const app = express();
app.use(express.json({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const userController = require('./controller/v1/User');
const healthController = require('./controller/v1/Health');

app.use('/api/v1/user', userController);
app.use('/api/v1/health', healthController);

const PORT = process.env.PORT;

connectDb();
app.listen(PORT, () => {
    console.log(`Listening on PORT number ${PORT} working...`);
});