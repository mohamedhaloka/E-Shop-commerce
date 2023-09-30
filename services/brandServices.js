const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError')
const BrandModel = require('../models/brandModel')
const { getAllDocs, getDocById, createDoc, updateOne, deleteOne } = require('./handlerFactory')


const memoryStorage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new ApiError("accept image only", 500), false)
    }
}

const upload = multer({
    storage: memoryStorage,
    fileFilter: fileFilter
})

exports.resizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        return next();
    }
    const fileName = `brand_${req.file.originalname}_${Date.now()}.jpeg`
    const imagesPath = '/upload/';
    const filePath = __dirname.replace("/services", '') + imagesPath;

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(`upload/${fileName}`)

    req.body.image = fileName;

    next();
})

exports.uploadBrandImage = upload.single('image')

exports.createBrand = createDoc(BrandModel)

exports.updateBrand = updateOne(BrandModel)

exports.deleteBrand = deleteOne(BrandModel)

exports.getBrands = getAllDocs(BrandModel)

exports.getBrand = getDocById(BrandModel)