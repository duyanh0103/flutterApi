const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    pid: {
        type: String,
        unique: true,
    },
    price: Number,
    title: String,
    url: String,
    country: String,
    brand: String,
    category_sn: String,
    details: String,
    on_sale: Boolean    
})

module.exports = mongoose.model('Product',ProductSchema)