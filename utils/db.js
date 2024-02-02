const  mongoose  = require("mongoose");
const logger = require('pino')()

module.exports.connectDb = () => {
    mongoose
        .connect("mongodb://127.0.0.1:27017/artistalley")
        .then(() => {
            logger.info("Database connected.")
        })
        .catch(() => {
            console.error("An error occurred while connecting to database");
            logger.error("Database connection error.")
        });
};