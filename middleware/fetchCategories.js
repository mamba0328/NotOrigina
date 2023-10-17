const Category = require('../models/category');  // Replace with your category model
async function fetchCategories(req, res, next) {
    try {
        const categories = await Category.find(); // Fetch categories from your database
        res.locals.categories = categories; // Make categories available globally
        next();
    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports = fetchCategories;
