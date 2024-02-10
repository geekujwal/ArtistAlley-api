const logger = require('pino')()
const { v4: uuidv4 } = require('uuid');
const { ContentDocument } = require('../document/ContentDocument');
const { Messages } = require('../common/Message');

exports.AddNewContent = async (req, res, next) => {
    const { title } = req.body
    try {
        var newContent = new ContentDocument({
            id: uuidv4(),
            title: title.toLowerCase(),
            created: new Date().toUTCString(),
            userId: req.user.id
        })
        await newContent.save()
        return res.status(201).json({
            id: newContent.id
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}

exports.DeleteContent = async (req, res, next) => {
    const { id } = req.params
    try {
        const content = await ContentDocument.find({ id: id })
        if (!content)
        {
            return res.status(404).json({
                message: "Content not found"
            })
        }
        if(content.userId !== req.user.id)
        {
            return res.status(400).json({
                message:"Stuff belongs to someone else"
            })
        }
        await ContentDocument.deleteMany({ id: id })
        return res.status(201).json({
            id: id
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}
