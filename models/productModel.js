const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minLength: [5, 'Min product length is 5 char'],
        maxLength: [100, 'Max product length is 5 char'],
    },
    slug: { type: String, required: true, lowercase: true, },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minLength: [20, 'Min product length is 5 char'],
        maxLength: [600, 'Max product length is 5 char'],
    },
    quantity: { type: Number, required: true },
    solidTimes: { type: Number, default: 0 },
    price: { type: Number, required: true, max: 200000 },
    priceAfterDiscount: { type: Number },
    colors: [String],
    imageCover: { type: String, required: true },
    images: [String],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory"
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: "Brand"
    },
    ratingAvarage: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingQuantity: Number,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
})

const reAssignImagesWithBaseUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }

    if (doc.images) {
        const images = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/${image}`;
            images.push(imageUrl);
        })

        doc.images = images;
    }
}

productSchema.post('init', reAssignImagesWithBaseUrl)
productSchema.post('save', reAssignImagesWithBaseUrl)


const ProductModel = mongoose.model('Product', productSchema)

module.exports = ProductModel;