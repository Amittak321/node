const mongoose = require('mongoose');
//Product Schema
const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    productName: String,
    image1: String,
    image2: String,
    image3: String,
    price: Number,
    quantity: Number
});

module.exports = mongoose.model('Product', productSchema);
 