exports.HealthPing = async (req, res, next) => {
    res.status(200).json({
        msg: "working"
    });
}
