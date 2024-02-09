const { sendMail } = require("../extension/SendMail");

exports.HealthPing = async (req, res, next) => {
    sendMail({
        recipient : "ujwal@appboxtech.com",
        subject: "Test mail",
        body: "This is body of test mail"
    });
    res.status(200).json({
        msg: "working"
    });
}
