const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Category = require('../models/category');
const Item = require('../models/item')
const Iteminstance = require('../models/iteminstance')

const categoriesController = {
    get: asyncHandler(async (req, res, next) => {
        const caseInsensitiveCategoryName = { $regex: new RegExp("^" + req.params.category.toLowerCase(), "i")};

        const category = await Category.findOne({name: caseInsensitiveCategoryName});
        const categoryItems = await Item.find({category: category._id});
        // const categoryIteminstance = await Promise.all(categoryItems.map(item => Iteminstance.findOne({item: item._id})));
        //
        // const items = categoryIteminstance.map(instance => {
        //     const itemOfInstance = categoryItems.find(item => item._id === instance.item);
        //     console.log(itemOfInstance)
        //     itemOfInstance.price = instance.price;
        //     return itemOfInstance
        // })

        console.log(items)
        if(category === null){
            const error = new Error('no such category');
            error.code = 404;
            next(error);
        }

        res.render('category', {title: category.name, currentCategory:category.name, category, categoryItems})
    }),
}

module.exports = categoriesController;