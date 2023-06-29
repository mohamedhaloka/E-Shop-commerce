const mongoose = require('mongoose');


const subCategrorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sub category name must be added'],
        unique: [true, 'Sub category name must be unique'],
        minLength: 4,
        maxLength: 35,
    },
    slug: {
        type: String,
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, "Sub category name must be added"],
    },
    image: String,
}, { timestamps: true });


const SubCategoryModel = mongoose.model("SubCategory", subCategrorySchema);

module.exports = SubCategoryModel;