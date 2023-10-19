const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: { type: String, minLength: 3, maxLength: 99, required: true },
    description: { type: String, maxLength: 500 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    imgPath: { type: String },
    lowestPrice: {type: Number, min: 0, },
});

itemSchema.virtual('url').get(function (){
    return slugify(this.name, { lower: true, replacement: '_' });
})


const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;