const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const brandSchema = mongoose.Schema({
    name: { type: String, required: true },
    emailBrand: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    adress: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true }); // Thêm timestamps vào schema)

brandSchema.plugin(aggregatePaginate);
const Product = mongoose.model('Brands', brandSchema);

module.exports = Product;
