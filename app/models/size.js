const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const brandSchema = mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true }); // Thêm timestamps vào schema)

brandSchema.plugin(aggregatePaginate);
const Product = mongoose.model('Sizes', brandSchema);

module.exports = Product;
