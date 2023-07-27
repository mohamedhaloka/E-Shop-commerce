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

// @desc    Create new user
// @route   GET /api/v1/users/
// @access  Private (Admin)
exports.createUser = createDoc(UserModel)

// @desc    Update exist user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
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

// @desc    Update user password
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.updateUserPassword = asyncHandler(async (req, res) => {
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

// @desc    Delete existing user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = deleteOne(UserModel)


// @desc    Get all users
// @route   GET /api/v1/users/
// @access  Private (Admin)
exports.getAllUsers = getAllDocs(UserModel)


// @desc    Get user by id
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUserById = getDocById(UserModel)



// @desc    Get My Data (Logged User Data)
// @route   GET /api/v1/users/getLoggedUserData
// @access  Private (User)
exports.getLoggedUserData = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    if (!user) {
        throw new ApiError('no user exist', 404)
    }

    res.status(200).json({
        status: "success",
        message: "fetch user data successfully",
        data: user,
    })
})

// @desc    Update Logged User Data
// @route   GET /api/v1/users/updateLoggedUserData
// @access  Private (User)
exports.updateLoggedUserData = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profImage: req.body.profImage,
    }, { new: true })

    if (!user) {
        throw new ApiError('no user exist', 404)
    }

    res.status(200).json({
        status: "success",
        message: "user data updated successfully",
        data: user,
    })
})

// @desc    Update Logged User Password
// @route   GET /api/v1/users/updateLoggedUserPassword
// @access  Private (User)
exports.updateLoggedUserPassword = asyncHandler(async (req, res) => {
    req.body.password = crypt(req.body.password)
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        password: req.body.password,
    }, { new: true })

    if (!user) {
        throw new ApiError('no user exist', 404)
    }

    res.status(200).json({
        status: "success",
        message: "user password updated successfully",
        data: user,
    })
})

// @desc    Deactive Logged User Password
// @route   GET /api/v1/users/deactiveLoggedUserPassword
// @access  Private (User)
exports.deactiveLoggedUserAccount = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        active: false,
    }, { new: true })

    if (!user) {
        throw new ApiError('no user exist', 404)
    }

    res.status(200).json({
        status: "success",
        message: "account deactivated successfully",
    })
})

