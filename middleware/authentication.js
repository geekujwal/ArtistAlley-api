const jwt = require("jsonwebtoken");
const { UserType } = require("../contract/UserType");
const { Messages } = require("../common/Message");

exports.adminAuth = async function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ msg: Messages.accessDenied });
    }
    try {
        await jwt.verify(token, "" + process.env.JWTSECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
            } else {
                if (decoded.user.type == UserType.ADMIN) {
                    req.user = decoded.user;
                    next();
                } else {
                    return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
                }
            }
        });
    } catch (err) {
        console.error("something wrong with auth middleware");
        return res.status(500).json({ errors: [{ msg: 'An error occured' }] });
    }
};

exports.moderatorAuth = async function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ msg: Messages.accessDenied });
    }
    try {
        await jwt.verify(token, "" + process.env.JWTSECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
            } else {
                if (decoded.user.type == UserType.ADMIN || decoded.user.type == UserType.MODERATOR) {
                    req.user = decoded.user;
                    next();
                } else {
                    return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
                }
            }
        });
    } catch (err) {
        console.error("something wrong with auth middleware");
        return res.status(500).json({ errors: [{ msg: 'An error occured' }] });
    }
};

exports.contentCreatorAuth = async function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ msg: Messages.accessDenied });
    }
    try {
        await jwt.verify(token, "" + process.env.JWTSECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
            } else {
                if (decoded.user.type == UserType.ADMIN || decoded.user.type == UserType.MODERATOR || decoded.user.type == UserType.CONTENTCREATOR) {
                    req.user = decoded.user;
                    next();
                } else {
                    return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
                }
            }
        });
    } catch (err) {
        console.error("something wrong with auth middleware");
        return res.status(500).json({ errors: [{ msg: 'An error occured' }] });
    }
};

exports.userAuth = async function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ msg: Messages.accessDenied });
    }
    try {
        await jwt.verify(token, "" + process.env.JWTSECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ errors: [{ msg: Messages.accessDenied }] });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error("something wrong with auth middleware");
        return res.status(500).json({ errors: [{ msg: 'An error occured' }] });
    }
};

