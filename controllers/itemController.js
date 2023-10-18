const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Item = require('../models/item')
const Iteminstance = require('../models/iteminstance');

const itemController = {
    get: asyncHandler(async (req, res, next) => {
        const caseInsensitiveItemName = { $regex: new RegExp("^" + req.params.item.replace('_',' ').toLowerCase(), "i")};

        const item = await Item.findOne({ name: caseInsensitiveItemName });
        const iteminstances = await Iteminstance.find({item:item.id},).populate('item').exec();
        const choosenIteminstance = iteminstances.find(instance => instance.size === req.query.size) ?? null;

        if(item === null){
            res.render('item', {title:'No such item'});
        }

        res.render('item', {title: item.name, item, iteminstances, choosenIteminstance});
    }),
}

module.exports = itemController;