const logger = require('pino')()
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Messages } = require("../common/Message");
const { UserDocument } = require("../document/UserDocument");
const { CreateVerificationToken, VerifyUserToken } = require("./VerificationService");
const { sendMail } = require('../extension/SendMail');
const { OTPTemplate } = require('../template/otptemplate');
const { UserType } = require('../contract/UserType');
const { EncryptPassword, VerifyPassword } = require('../extension/PasswordEncryption');


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
        if(!process.env.DEV )
        {
            await sendMail(email, OTPTemplate.SubjectPart, OTPTemplate.HTMLPart(otpToken));
        }
        return res.status(204).send();
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}

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
        user.password = await EncryptPassword(password);
        user.type = UserType.USER;
        user.save()
        // todo send welcome to artistAlley mail after this process
        return res.status(200).json({
            message: Messages.newUserCreated
        })
    } catch (err) {
        console.log(err)
        logger.error("server side exception ", err)
        res.status(500).send('server side exception');
    }
}

exports.Login = async (req, res, next) => {
    const { email, password, type } = req.body;
    // todo add try catch
    const user = await UserDocument.findOne({
        $and: [
            { email: email },
        ]
    })
    // todo how many fail attemps are we gonna give to user? how long will user be unable to login after x number of failed attempted?
    // todo If failed attempt reach maximum send an email to user informing them when they can retry again or reset their password
    if (!user || !await VerifyPassword(password, user.password) || user.type !== type) {
        return res.status(404).json({
            message: Messages.userNotFound
        })
    }
    const payload = {
        user: {
          id: user.id,
          type: user.type
        }
      };
      jwt.sign(
        payload,
        "" + process.env.JWTSECRET,
        { expiresIn: process.env.JWTEXPIRESIN },
        (err, token) => {
          if (err) throw err;
          res.json({ accessToken: token });
        }
      );
}
