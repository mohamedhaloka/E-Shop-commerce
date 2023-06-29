const mongoose = require('mongoose')


const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand must be required'],
        unique: [true, 'Brand must be unique'],
        maxLength: [20, 'MaxLength must be at least 20 characters for brands']
    },
    slug: {
        type: String,
    },
    image: String,
}, { timestamps: true })


const addBaseUrlToImage = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}

brandSchema.post('init', addBaseUrlToImage)

brandSchema.post('save', addBaseUrlToImage)

const BrandModel = mongoose.model('Brand', brandSchema)

module.exports = BrandModel;