const fs = require('fs');

const multer = require('multer');
const asyncHandler = require('express-async-handler')
const sharp = require('sharp');

const categoryModel = require('../models/categoryModel');
const { getAllDocs, getDocById, createDoc, updateOne, deleteOne } = require('./handlerFactory')

const ApiError = require('../utils/apiError')


// Desktop Storage
// const storage = multer.diskStorage({
//     destination: async (req, file, cb) => {
//         const imagesPath = '/upload/';
// const filePath = __dirname.replace("/services", '') + imagesPath;
//
//         console.log(filePath);
//         if (!fs.existsSync(filePath)) {
//             await fs.mkdirSync(filePath);
//         }
//         cb(null, filePath)
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
// const fileName = `category_${file.originalname.trim().replace("", '_')}_${Date.now()}.${ext}`
//         cb(null, fileName)
//     }
// })

// Memorey Storage
const memoryStorage = multer.memoryStorage()


const multerFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[0];

    if (type === 'image') {
        cb(null, true)
    } else {
        cb(new ApiError("only images allowed", 400), false)
    }
};

const upload = multer({
    storage: memoryStorage,
    fileFilter: multerFilter,
})

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category_${req.file.originalname}_${Date.now()}.jpg`
    const imagesPath = '/upload/';
    const filePath = __dirname.replace("/services", '') + imagesPath;

    if (!fs.existsSync(filePath)) {
        await fs.mkdirSync(filePath);
    }

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpg')
        .jpeg({ quality: 85 })
        .toFile(`upload/${fileName}`)

    req.body.image = fileName;
    next();
})

exports.uploadCategoryFile = upload.single('image')

// @desc    get All Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = getAllDocs(categoryModel)


// @desc    get Specific Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategoryById = getDocById(categoryModel)

// @desc    update Specific Category
// @route   PATCH /api/v1/categories/:id
// @access  Public
exports.updateCategory = updateOne(categoryModel)

// @desc    delete Specific Category
// @route   DEL /api/v1/categories/:id
// @access  Public
exports.deleteCategory = deleteOne(categoryModel)


// @desc    Create Category
// @route   Post /api/v1/categories
// @access  Private
exports.createCategory = createDoc(categoryModel)