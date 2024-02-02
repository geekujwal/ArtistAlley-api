const logger = require('pino')()
const { Messages } = require("../common/Message");
const { UserDocument } = require("../document/UserDocument");
const { v4: uuidv4 } = require('uuid');
const { CreateVerificationToken } = require("./VerificationService");


exports.RequestRegisterToken = async (req, res, next) => {
    const { username, name, email, password } = req.body;
    try {
        const user = await UserDocument.findOne(
            {
                $or: [
                    { username: username },
                    { email: email }
                ]
            });
        if (user) {
            return res.status(400).json({ message: Messages.userAlreadyExist })
        }
        var newUser = new UserDocument({
            id: uuidv4(),
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            created: new Date().toUTCString()
        })        

        await newUser.save()
        await CreateVerificationToken(email);
        // todo create notification document to store it and send email/ sms later
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
