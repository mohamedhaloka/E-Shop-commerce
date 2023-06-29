const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError')
const { createDoc, deleteOne, getAllDocs, getDocById } = require('./handlerFactory')
const UserModel = require('../models/userModel')
const { crypt } = require('../utils/cryptHelper')

const memoryStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new ApiError('Only images are allowed', 400))
    }
}

const upload = multer({ storage: memoryStorage, fileFilter: fileFilter })


exports.resizeImage = asyncHandler(async (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        const fileName = `user_${req.file.originalname}_${Date.now()}.jpeg`
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

        req.body.profImage = fileName;
    }

    next();
})

exports.uploadProfImage = upload.single('profImage')

exports.createUser = createDoc(UserModel)

exports.updateUser = asyncHandler(async (req, res, next) => {
    const doc = await UserModel.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profImage: req.body.profImage,
            role: req.body.role,
        },
        { new: true });

    if (!doc) {
        return res.status(404).json({
            success: "error",
            message: `Item not found for id: ${req.params.id}`
        });
    }

    res.status(200).json({
        success: "success",
        message: 'item updated successfully',
        data: doc
    });
})

exports.updateUserPassword = asyncHandler(async (req, res) => {
    req.body.password = crypt(req.body.password)
    const doc = await UserModel.findByIdAndUpdate(req.params.id,
        {
            password: req.body.password,
            passwordChangedAt: Date.now(),
        },
        { new: true });

    if (!doc) {
        return res.status(404).json({
            success: "error",
            message: `Item not found for id: ${req.params.id}`
        });
    }
    res.status(200).json({
        success: "success",
        message: 'item updated successfully',
        data: doc
    });
})

exports.deleteUser = deleteOne(UserModel)

exports.getAllUsers = getAllDocs(UserModel)

exports.getUserById = getDocById(UserModel)