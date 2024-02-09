const logger = require('pino')()
const { Messages } = require("../common/Message");
const { UserDocument } = require("../document/UserDocument");
const { v4: uuidv4 } = require('uuid');
const { CreateVerificationToken } = require("./VerificationService");
const { sendMail } = require('../extension/SendMail');
const { OTPTemplate } = require('../template/otptemplate');
const { UserType } = require('../contract/UserType');


exports.RequestRegisterToken = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const user = await UserDocument.findOne(
            {
                $or: [
                    { username: username },
                    { email: email }
                ]
            });
        if (user && user.type !== UserType.TEMPORARY) {
            return res.status(400).json({ message: Messages.userAlreadyExist })
        }
        // todo if user document isnt already there create it
        // todo else update previous user document
        // todo add more log
        if(!user)
        {
            var newUser = new UserDocument({
                id: uuidv4(),
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                created: new Date().toUTCString()
            })        
    
            await newUser.save()
        }else {
            user.username = username.toLowerCase()
            user.created = new Date().toUTCString()
            user.save()
        }
        const otpToken = await CreateVerificationToken(email);
        // todo create notification document to store it and send email/ sms later
        await sendMail(email, OTPTemplate.SubjectPart, OTPTemplate.HTMLPart(otpToken));
        return res.status(204).send();
    } catch (err) {
        console.log(err)
        logger.error(`An error occuried while creating user ${err}`)
        res.status(400).send('An error occuried while verifying user token');
    }
}

exports.VerifyToken = async (req, res, next) => {
    const { token, email } = req.body;
    try {

    } catch (err) {
        console.log(err)
        logger.error("An error occuried while verifying user token ", err)
        res.status(400).send('An error occuried while verifying user token');
    }
}

exports.CompleteRegistration = async (req, res, next) => {
    const { password, email, name } = req.body;
    try {
        // todo search user using his/her email and update its name and password with hash also change user's account type to user (before it was temp user)
    } catch (err) {
        console.log(err)
        logger.error("An error occuried while verifying user token ", err)
        res.status(400).send('An error occuried while verifying user token');
    }
}
