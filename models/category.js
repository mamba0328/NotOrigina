const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: { type: String, minLength: 3, required: true },
    description: { type: String },
})

categorySchema.virtual('url').get(function (){
    return slugify(this.name, { lower: true, replacement: '_' });
})

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;