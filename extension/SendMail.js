const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, 
    },
});

const sendmail = async (recipient, subject, body) => {
    console.log("from sendemail function "+recipient, subject, body)
    const info = await transporter.sendMail({
        from: '"Ujwal From ArtistAlley 👻" <itsujwal2019@gmail.com>', 
        to: [recipient],
        subject: subject,
        html: body,
    });

    console.log("Message sent: %s", info.messageId);
}
exports.sendMail = sendmail;