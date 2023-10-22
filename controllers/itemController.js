const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Item = require('../models/item')
const Iteminstance = require('../models/iteminstance');
const Category = require('../models/category')

const itemController = {
    get: asyncHandler(async (req, res, next) => {
        const name = req.params.item.replaceAll('_', ' ');
        const caseInsensitiveItemName = { $regex: new RegExp("^" + name, "i")};

        const item = await Item.findOne({ name: caseInsensitiveItemName }).populate('category');
        const iteminstances = await Iteminstance.find({item:item.id},).populate('item').exec();
        const choosenIteminstance = iteminstances.find(instance => instance.size === req.params.size) ?? null;
        if(item === null){
            res.render('item/item', {title:'No such item'});
        }

        res.render('item/item', {title: item.name, item, iteminstances, choosenIteminstance});
    }),

    createGet: asyncHandler(async (req, res, next) => {
        const categoryId = req.query.category;
        const categories = await Category.find({});
        const category = await Category.findById(categoryId);

        res.render('item/itemForm', {title:'Create item', categories, item:{category: category._id}} )
    }),

    createPOST: [
        body('name', 'Min name is 3 symb').trim().isLength({min:3}).escape(),
        body('category', 'You need specify category').notEmpty().escape(),
        body('description').trim().escape(),

        asyncHandler(async (req, res, next) => {
            const name = req.body.name;
            const description = req.body.description;
            const category = await Category.findById(req.body.category);
            const categories = await Category.find({});

            const result = validationResult(req);
            const errors = result.errors;

            if(errors.length){
                res.render('item/itemForm', {title:'Create item', item: {name, description, category: category._id}, errors, categories})
            }

            const caseInsensitiveItemName = { $regex: new RegExp("^" + name.toLowerCase(), "i")};
            const item = await Item.findOne({name: caseInsensitiveItemName}).populate('category');

            if(item !== null){
                return res.redirect(`/${item.url}`);
            }

            const newItem = new Item({name, description, category, imgPath: 'path_to_img',});
            await newItem.save();
            await res.redirect(`/${newItem.url}`);
        }),
    ],

    deleteGET: asyncHandler(async (req, res, next) => {
        const name = req.params.item.replaceAll('_', ' ');
        const caseInsensitiveItemName = { $regex: new RegExp("^" + name, "i")};
        const item = await Item.findOne({name: caseInsensitiveItemName}).populate('category');

        const iteminstances = await Iteminstance.find({item: item._id});

        if(iteminstances.length){
            const error = {
                msg: 'You need to delete all itemsinstaces first'
            }
            return  res.render('item/item', {title: item.name, item, iteminstances, choosenIteminstance: null, error});
        }

        await Item.findByIdAndDelete(item._id);
        return res.redirect(`/${item.category.url}`);
    }),
}

module.exports = itemController;