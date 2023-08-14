const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User id is required']
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product"
        },
        color: String,
        price: Number,
        quantity: Number,
    }],
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    totalOrderPrice: {
        type: Number
    },
    shippingAddress: {
        type: String,
        required: [true, 'shippingAddress is required']
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    isDelevired: {
        type: Boolean,
        default: false,
    },
    deleviredAt: Date,
}, { timeseries: true })


OrderSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' })
        .populate({ path: 'cartItems.product', select: 'title imgCover' })
    next()
})

const OrderModel = mongoose.model('Order', OrderSchema)

module.exports = OrderModel