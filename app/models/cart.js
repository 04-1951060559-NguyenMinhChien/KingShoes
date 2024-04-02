const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const CartSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
}, { timestamps: true });

CartSchema.plugin(aggregatePaginate);
const Cart = mongoose.model('Carts', CartSchema);

module.exports = Cart;