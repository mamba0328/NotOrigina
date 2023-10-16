const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemInstanceSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    size: { type: String, maxLength: 10, required: true },
    price: { type: Number, required: true, min: 0 },
    number_in_stock: { type: Number, required: true, min: 0 }
})

itemInstanceSchema.virtual('url').get(function () {
    const encodedSize = encodeURIComponent(this.size);
    return `${this.item.url}?size=${encodedSize}`;
});

const iteminstanceModel = mongoose.model('Iteminstance', itemInstanceSchema);

module.exports = iteminstanceModel;