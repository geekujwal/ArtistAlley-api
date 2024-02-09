const logger = require('pino')()
const { Messages } = require("../common/Message");
const { UserDocument } = require("../document/UserDocument");
const { v4: uuidv4 } = require('uuid');
const { CreateVerificationToken, VerifyUserToken } = require("./VerificationService");
const { sendMail } = require('../extension/SendMail');
const { OTPTemplate } = require('../template/otptemplate');
const { UserType } = require('../contract/UserType');
const { UserVerificationDocument } = require('../document/userVerificationDocument');


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
        if (!user) {
            var newUser = new UserDocument({
                id: uuidv4(),
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                created: new Date().toUTCString()
            })
            await newUser.save()
        } else {
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

// exports.VerifyToken = async (req, res, next) => {
//     const { token, email } = req.body;
//     try {

//     } catch (err) {
//         console.log(err)
//         logger.error("An error occuried while verifying user token ", err)
//         res.status(400).send('An error occuried while verifying user token');
//     }
// }

exports.CompleteRegistration = async (req, res, next) => {
    const { token, password, email, name } = req.body;
    try {
        const user = await UserDocument.findOne(
            {
                email: email
            });
        if (user && user.type !== UserType.TEMPORARY) {
            return res.status(400).json({ message: Messages.userAlreadyExist })
        }
        const verifyToken = await VerifyUserToken(user.email, token)
        if (!verifyToken) {
            return res.status(400).json({ message: Messages.invalidToken })
        }
        user.name = name;
        // todo encrypt password here 
        // todo for better use make a extension function for encryption and decryption
        user.password = password;
        user.type = UserType.USER;
        user.save()
        // todo send welcome to artistAlley mail after this process
        return res.status(200).json({
            message: Messages.newUserCreated
        })
    } catch (err) {
        console.log(err)
        logger.error("An error occuried while verifying user token ", err)
        res.status(400).send('An error occuried while verifying user token');
    }
}

exports.Login = async (req, res, next) => {
    const {email, password, type} = req.body;
    // todo add try catch
    const user = await UserDocument.findOne({
        $and: [
            { email: email },
            { type: type.toLowerCase() } // should we check for type here or later ? idk what is better need to think about it in future
        ]
    })

    if(!user || user.password === password) {
        return res.status(404).json({
            message: Messages.userNotFound
        })
    }
    return res.status(200).json({
        message: user
    })
}
