const bcrypt = require('bcryptjs');

exports.EncryptPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
exports.VerifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compareSync(password, hashedPassword);
}
