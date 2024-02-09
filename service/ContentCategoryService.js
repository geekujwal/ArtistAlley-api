const logger = require('pino')()
const { v4: uuidv4 } = require('uuid');
const { ContentCategoryDocument } = require('../document/ContentCategoryDocument');
const { Messages } = require('../common/Message');

exports.AddNewContentCategory = async (req, res, next) => {
    const { name } = req.body
    try {
        const category = await ContentCategoryDocument.findOne(
            { name: name }
        );
        if (category) {
            return res.status(400).json({ message: Messages.categoryAlreadyExist })
        }
        var newCategory = new ContentCategoryDocument({
            id: uuidv4(),
            name: name.toLowerCase(),
            created: new Date().toUTCString(),
            userId: req.user.id
        })
        await newCategory.save()
        return res.status(201).json({
            id: newCategory.id
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}

exports.DeleteContentCategory = async (req, res, next) => {
    const { ids } = req.body
    let contentCategoryDeletedIds = [];
    try {
        const contentCategories = await ContentCategoryDocument.find({ id: { $in: ids } })
        contentCategoryDeletedIds = contentCategories.map(doc => doc.id)
        await ContentCategoryDocument.deleteMany({ id: { $in: ids } })
        return res.status(201).json({
            ids: contentCategoryDeletedIds
        })
    } catch (err) {
        console.log(err)
        logger.error(`server side exception ${err}`)
        res.status(500).send('server side exception');
    }
}
