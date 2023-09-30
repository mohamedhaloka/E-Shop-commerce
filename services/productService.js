const fs = require('fs');

const asyncHandler = require('express-async-handler');
const multer = require('multer');
const sharp = require('sharp');

const ProductModel = require('../models/productModel')
const { deleteOne, updateOne, createDoc, getAllDocs, getDocById } = require('./handlerFactory')
const ApiError = require('../utils/apiError')

const memoryStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new ApiError("image only valid", 400), false)
    }
}

const upload = multer({ storage: memoryStorage, fileFilter: fileFilter })


exports.uploadProductImage = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1
    }, {
        name: 'images',
        maxCount: 4
    }
])

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const fileName = `image_${req.files.imageCover[0].originalname}_${Date.now()}.jpg`
        const imagesPath = 'upload/';
        const filePath = __dirname.replace("/services", '') + imagesPath;

        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }

        await sharp(req.files.imageCover[0].buffer)
            .resize(200, 200)
            .toFormat('jpeg')
            .jpeg({ quality: 85 })
            .toFile(`${imagesPath}${fileName.replace(' ', '_')}`)

        req.body.imageCover = fileName;
    }

    if (req.files.images) {
        const images = [];
        await Promise.all(req.files.images.map(async (image, index) => {
            const fileName = `image_${image.originalname}_${Date.now()}-${index + 1}.jpg`
            const imagesPath = 'upload/';
            const filePath = __dirname.replace("/services", '') + imagesPath;

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }

            await sharp(req.files.imageCover[0].buffer)
                .resize(200, 200)
                .toFormat('jpeg')
                .jpeg({ quality: 85 })
                .toFile(`${imagesPath}${fileName.replace(' ', '_')}`)


            images.push(fileName)

        }))

        req.body.images = images;
    }

    next()
})

// @desc    get All Products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = getAllDocs(ProductModel, "Products")

// @des    get Product By Id
// @route  GET /products/:id
// @access Public
exports.getProductById = getDocById(ProductModel)

// @des    delete Product
// @route  DELETE /products/:id
// @access Private
exports.deleteProduct = deleteOne(ProductModel)

exports.checkUpdatePRoductBodyIsEmpty = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: "error",
            message: 'No body provided add at least one filed'
        })
    }
    next()
}

// @des    update Product
// @route  PATCH /products/:id
// @access Private
exports.updateProduct = updateOne(ProductModel)

// @des    create Product
// @route  POST /products/:id
// @access Private
exports.createProduct = createDoc(ProductModel)