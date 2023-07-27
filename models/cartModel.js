const mongoose = require('mongoose')


const CartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product"
        },
        color: String,
        price: Number,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    totalProductsPrice: Number,
    totalProductsPriceWithDiscount: Number,
}, { timestamps: true })


const CartModel = mongoose.model('Cart', CartSchema)

module.exports = CartModel