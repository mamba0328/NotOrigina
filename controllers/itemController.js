const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Item = require('../models/item')
const Iteminstance = require('../models/iteminstance');
const Category = require('../models/category')

const itemController = {
    get: asyncHandler(async (req, res, next) => {
        const caseInsensitiveItemName = { $regex: new RegExp("^" + req.params.item.replace('_',' ').toLowerCase(), "i")};

        const item = await Item.findOne({ name: caseInsensitiveItemName }).populate('category');
        const iteminstances = await Iteminstance.find({item:item.id},).populate('item').exec();
        const choosenIteminstance = iteminstances.find(instance => instance.size === req.query.size) ?? null;

        if(item === null){
            res.render('item', {title:'No such item'});
        }

        res.render('item', {title: item.name, item, iteminstances, choosenIteminstance});
    }),

    createGet: asyncHandler(async (req, res, next) => {
        const categoryId = req.query.category;
        const categories = await Category.find({});
        const category = await Category.findById(categoryId);

        res.render('itemForm', {title:'Create item', categories, item:{category: category._id}} )
    }),

    createPOST: [
        body('name', 'You need specify name').trim().isLength({min:1}).escape(),
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
                res.render('itemForm', {title:'Create item', item: {name, description, category: category._id}, errors, categories})
            }

            const caseInsensitiveItemName = { $regex: new RegExp("^" + name.toLowerCase(), "i")};
            const item = await Item.findOne({name: caseInsensitiveItemName}).populate('category');

            if(item !== null){
                return res.redirect(`/${category.url}/${item.url}`);
            }

            const newItem = new Item({name, description, category, imgPath: 'path_to_img',});
            await newItem.save();
            await res.redirect(`/${category.url}/${newItem.url}`);
        }),
    ],

    deleteGET: asyncHandler(async (req, res, next) => {
        const id = req.params.id;
        const item = await Item.findById(id).populate('category');
        const iteminstances = await Iteminstance.find({item: id});

        if(iteminstances.length){
            const error = {
                msg: 'You need to delete all itemsinstaces first'
            }
            return  res.render('item', {title: item.name, item, iteminstances, choosenIteminstance: null, error});
        }

        await Item.findByIdAndDelete(id);
        return res.redirect(`/${item.category.url}`);
    }),
}

module.exports = itemController;