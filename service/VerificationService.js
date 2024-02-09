const { v4: uuidv4 } = require('uuid');
const logger = require('pino')()
const { UserVerificationDocument } = require("../document/userVerificationDocument");
const { generateVerificationToken } = require('../utils/verificationToken');

exports.CreateVerificationToken = async (email) => {
    logger.info(`Creating verification token for email: ${email}`)
    const verificationdoc = await UserVerificationDocument.findOne(
        { email }
    );
    const verifyToken = generateVerificationToken()
    if (verificationdoc) {
        logger.info("Verification token document already exists")
        // remove old tokens and add new one
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
