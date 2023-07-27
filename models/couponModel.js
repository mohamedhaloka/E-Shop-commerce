const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'Name of Coupon should be unique'],
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    discount: Number,
    isPrecentage: {
        type: Boolean,
        default: false,
    },
}, { timeseries: true })


const CouponModel = mongoose.model('Coupon', CouponSchema)

module.exports = CouponModel