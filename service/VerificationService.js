const { v4: uuidv4 } = require('uuid');
const logger = require('pino')()
const { UserVerificationDocument } = require("../document/userVerificationDocument");
const { generateVerificationToken } = require('../utils/verificationToken');

exports.CreateVerificationToken = async (email) => {
    logger.info(`Creating verification token for email: ${email}`)
    const verificationdoc = await UserVerificationDocument.findOne(
        { email }
    );
    const verifyToken = process.env.DEV ? "999999" : generateVerificationToken()
    if (verificationdoc) {
        logger.info("Verification token document already exists")
        // remove old tokens and add new one
        // but what we can do instead is make a schduler which will check for expire token and remove them instead of replacing token 
        verificationdoc.lastAttemptAt = new Date().toUTCString()
        verificationdoc.token = [{
            token: verifyToken,
            createdAt: new Date().toUTCString()
        }]
        verificationdoc.totalAttemps = 0;
        await verificationdoc.save()
    }
    else {
        logger.info("Verification token document doesnt exists")
        // create new doc and add token
        var verification = new UserVerificationDocument({
            id: uuidv4(),
            email: email,
            lastAttemptAt: new Date().toUTCString(),
            token: [{
                token: verifyToken,
                createdAt: new Date().toUTCString()
            }],
            totalAttemps: 0,
            created: new Date().toUTCString()
        })
        await verification.save();
    }
    logger.info(`Verification token creating process ended`)
    return verifyToken;
}
exports.VerifyUserToken = async (email, token) => {
    // todo add try catch here also logger
    const userToken = await UserVerificationDocument.findOne(
        {
            email: email
        });
    if (userToken && userToken.token.some(item => item.token == token)) {
        return true;
    }
    return false;
}
