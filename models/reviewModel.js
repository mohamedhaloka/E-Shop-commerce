const mongoose = require('mongoose');

const ProductModel = require('./productModel')

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: [40, "Max Length for title is 40 characters"]
    },
    rating: {
        type: Number,
        min: [1, "the min rating is 1"],
        max: [5, "the max rating is 5"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
}, { timestamps: true })

ReviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name _id' })
    next();
})

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAvarageAndQuantity(this.product);
})

ReviewSchema.statics.calculateAvarageAndQuantity = async function (productId) {
    const result = await this.aggregate([
        //Stage 1 Match all reviews with the same product id
        {
            $match: { product: productId }
        },
        //Stage 2 Grouping all reviews with avg and sum 
        {
            $group: {
                _id: "$product",
                avg: { $avg: "$rating" },
                sum: { $sum: 1 },
            }
        }
    ])

    if (result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingAvarage: result[0].avg,
            ratingQuantity: result[0].sum,
        }, { new: true },)
    }

    console.log(result)
}


const ReviewModel = mongoose.model("Review", ReviewSchema)

module.exports = ReviewModel;