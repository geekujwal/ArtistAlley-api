const logger = require('pino')()
const { v4: uuidv4 } = require('uuid');
const { CommentDocument } = require('../document/CommentDocument');
const { Messages } = require('../common/Message');

exports.AddNewComment = async (req, res, next) => {
    const { text, parentId } = req.body
    const { contentId } = req.params
    try {
        // todo check if content exists or not
        // todo check if parent exists or not
        var newComment = new CommentDocument({
            id: uuidv4(),
            text: text,
            contentId: contentId,
            userId: req.user.id,
            parentId: parentId,
            created: new Date().toUTCString(),
            userId: req.user.id
        })
        await newComment.save()
        return res.status(201).json({
            id: newComment.id
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}

exports.DeleteComment = async (req, res, next) => {
    const { id } = req.params
    try {
        const comment = await CommentDocument.findOne({ id: id })
        if (!comment) {
            return res.status(404).json({
                message: "comment not found"
            })
        }
        console.log("userId nad commented user",comment.userId , req.user.id )
        if (comment.userId !== req.user.id) {
            return res.status(400).json({
                message: "Stuff belongs to someone else"
            })
        }
        await CommentDocument.deleteMany({ id: id })
        return res.status(201).json({
            id: id
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}
