const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")

const Iteminstance = require('../models/iteminstance');
const Item = require('../models/item');

const iteminstanceController = {
    deleteGET: asyncHandler(async(req, res, next) => {
        const name = req.params.item.replaceAll('_', ' ');
        const caseInsensitiveItemName = { $regex: new RegExp("^" + name, "i")};
        const item = await Item.findOne({name: caseInsensitiveItemName}).populate('category');

        const iteminstance = await Iteminstance.findOne({item: item._id, size: req.params.size});
        await Iteminstance.findByIdAndDelete(iteminstance._id);

        return res.redirect(`${item.url}`);
    }),

    createGET: asyncHandler(async(req, res, next) => {
        const name = req.params.item.replaceAll('_', ' ');
        const caseInsensitiveItemName = new RegExp("^" + name, "i");

        const items = await Item.find({}).exec();
        const selectedItem = items.find(item => caseInsensitiveItemName.test(item.name));

        return res.render('iteminstance/iteminstanceForm', {title: 'Create iteminstance', items, selectedItem, instance: null,});
    }),

    createPOST: [
        body('item', 'You need specify item').notEmpty().escape(),
        body('size', 'Size should be 1-10 symb long').trim().isLength({min:1, max:10}).escape(),
        body('price', 'You need specify price').notEmpty().escape(),
        body('inStock').notEmpty().trim().escape(),

        asyncHandler(async(req, res, next) => {
            const {item, size, price, inStock, } = req.body;
            const items = await Item.find({}).exec();
            const selectedItem = items.find(itemObj => itemObj._id.toString() === item);
            const result = validationResult(req);
            const errors = result.errors;

            if(errors.length){
                console.log(errors)
                return res.render('iteminstance/iteminstanceForm', {title: 'Create iteminstance', items, selectedItem, errors, instance: {item, size, price, number_in_stock: inStock}, })
            }

            const itemsinstance = await Iteminstance.findOne({item, size}).populate('item');

            if(itemsinstance !== null){
                const newNumberInStock = +itemsinstance.number_in_stock + +inStock
                const newInstance = {
                    id:itemsinstance._id,
                    item:itemsinstance.item._id,
                    size:itemsinstance.size,
                    price:itemsinstance.price,
                    number_in_stock:newNumberInStock,
                }

                await Iteminstance.findByIdAndUpdate(itemsinstance._id, newInstance);
                return res.redirect(`/${itemsinstance.url}`)
            }

            const newInstance = new Iteminstance({item, size, price, number_in_stock: inStock});
            await newInstance.save();

            return res.redirect(`/${selectedItem.url}/${newInstance.size}`)
        }),
    ]
}

module.exports = iteminstanceController;