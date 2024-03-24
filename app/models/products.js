const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const productSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    status: { type: String },
    image: { type: String, require: true }, // Lưu trữ đường dẫn của hình ảnh
    price: { type: String },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Nguoidung' },
    size_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Diachi' }
}, { timestamps: true }); // Thêm timestamps vào schema)

productSchema.plugin(aggregatePaginate);
const Product = mongoose.model('Products', productSchema);

module.exports = Product;