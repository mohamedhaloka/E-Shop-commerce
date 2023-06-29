const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category name must be required"],
    unique: [true, "Category must be required"],
    minLength: [4, "Categories must be greater than 4 char"],
    maxLength: [25, "Category must be smaller than 25 char"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String,
  },
}, { timestamps: true })

const addBaseUrlToImage = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

categorySchema.post('init', addBaseUrlToImage)

categorySchema.post('save', addBaseUrlToImage)

const categoryModel = mongoose.model("category", categorySchema)

module.exports = categoryModel;