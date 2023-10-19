const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Category = require('../models/category');
const Item = require('../models/item')

const categoriesController = {
    get: asyncHandler(async (req, res, next) => {
        const caseInsensitiveCategoryName = { $regex: new RegExp("^" + req.params.category.toLowerCase(), "i")};

        const category = await Category.findOne({name: caseInsensitiveCategoryName});
        const categoryItems = await Item.find({category: category._id});

        if(category === null){
            const error = new Error('no such category');
            error.code = 404;
            next(error);
        }

        res.render('category/category', {title: category.name, currentCategory:category.name, category, categoryItems})
    }),

    createGET: asyncHandler(async (req, res, next) => {
        res.render('category/categoryForm', {title:'Create Category'})
    }),

    createPOST: [
        body('name', 'You need specify name').trim().isLength({min:1}).escape(),
        body('description').trim().escape(),

        asyncHandler(async (req, res, next) => {
            const name = req.body.name;
            const description = req.body.description;

            const result = validationResult(req);
            const errors = result.errors;
            if(errors.length){
                res.render('category/categoryForm', {title:'Create Category', name, description, errors})
            }

            const caseInsensitiveCategoryName = { $regex: new RegExp("^" + name.toLowerCase(), "i")};
            const category = await Category.findOne({name: caseInsensitiveCategoryName});

            if(category !== null){
                return res.redirect(`/${category.url}`)
            }

            const newCategory = new Category({name, description});
            await newCategory.save();
            await res.redirect(`/${newCategory.url}`);
        }),
    ],

    deleteGET: asyncHandler(async (req, res, next) => {
            const id = req.params.id;
            const category = await Category.findById(id);
            const categoryItems = await Item.find({category: id});

            if(categoryItems.length){
                const error = {
                    msg: 'You need to delete all items first'
                }
                return res.render('category/category', {title: category.name, currentCategory:category.name, category, categoryItems, error})
            }

            await Category.findByIdAndDelete(id);
            return res.redirect('/home');
        }),
}

module.exports = categoriesController;