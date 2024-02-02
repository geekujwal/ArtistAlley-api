const { UserDocument } = require("../document/UserDocument");
const { v4: uuidv4 } = require('uuid');


exports.RequestRegisterToken = async (req, res, next) => {
    var newUser = new UserDocument({
        id: uuidv4()
    })
    await newUser.save()
    res.status(200).send('Working');
}
