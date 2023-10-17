const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Category = require('../models/category');
const Item = require('../models/item')

const categoriesController = {
    get: asyncHandler(async (req, res, next) => {
        const caseInsansativeName = { $regex: new RegExp("^" + req.params.name.toLowerCase(), "i")};

        const category = await Category.findOne({name: caseInsansativeName});
        const categoryItems = await Item.find({category: category._id});

        if(category === null){
            const error = new Error('no such category');
            error.code = 404;
            next(error);
        }

        res.render('category', {title: category.name, category, categoryItems})
    }),
}

module.exports = categoriesController;