const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')

const UserModel = require('../models/userModel')
const ApiError = require('../utils/apiError')
const { crypt } = require('../utils/cryptHelper');
const sendMail = require('../utils/sendMail');

// @desc     Create a new account
// @route    /sign-up
// @access   Public
exports.signUp = asyncHandler(async (req, res) => {
    const user = await UserModel.create(req.body);

    const token = jwt.sign({ id: user._id }, "this-private-key-e-co", {
        expiresIn: "2d",
    })
    const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    };

    res.status(201).json({
        status: "create account successfully",
        data: data,
    })
})

// @desc     Login with existing account
// @route    /login
// @access   Public
exports.logIn = asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email, password: crypt(req.body.password), });

    if (!user) {
        throw new ApiError('Email or password wrong, please try again', 404)
    }

    if (!user.active) {
        throw new ApiError('Account not active', 400)
    }

    const token = jwt.sign({ id: user._id }, 'shop-e-token-p-key', {
        expiresIn: '2d',
    })

    const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    };

    res.status(200).json({
        status: "fetch account data successfully",
        data: data,
    })
})

// @desc     Validation the user token and accessbility of the user
exports.proccess = asyncHandler(async (req, res, next) => {
    // 1) chekc if token in headers and Get it
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new ApiError('authorization to use this route, you should add JWT', 401)
    }
    const token = authorization.split(' ')[1]

    //2) Verify token if exist
    const decodedData = jwt.verify(token, 'shop-e-token-p-key')
    const userId = decodedData.id

    //3) Check if user exists
    const user = await UserModel.findById(userId)

    //3.1) Check if account active or not
    if (!user.active) {
        throw new ApiError('Account not active', 400)
    }

    if (!user) {
        throw new ApiError('User not found', 401)
    }

    //4) Check if use change the password after token created
    // Convert second to milliseconds
    if (user.passwordChangedAt) {
        if ((user.passwordChangedAt.getTime() / 1000) > decodedData.iat) {
            throw new ApiError('you recently change the password, please login again', 401)
        }
    }

    req.user = user
    next();
})

// @desc     Check the accessbility of the user
exports.userAccess = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new ApiError(`this permission for ${roles} only`, 500)
    }
    next();
})

// @desc     Forget password
// @route    /forget-passowrd
// @access   Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //Check if account exist first by email address
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        throw new ApiError("No user found", 404)
    }
    //Generate a random code of 6 digits , hash it and save it into db
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeHashed = crypt(verificationCode)
    user.verificationCodeHashed = verificationCodeHashed
    //add a expired date to verification code
    const verificationCodeExpDate = Date.now() + 10 * 60 * 1000; //convert milliseconds to seconds to minutes (10Minutes)
    user.verificationCodeExp = verificationCodeExpDate

    user.verificationCodeDone = false

    //Send email via gmail (Nodemailer)
    const options = {
        email: user.email,
        subject: "Reset Verification Code",
        content: `Hello ${user.name},\n The Verification Code is ${verificationCode}\nThank your for using E-Learning`,
    }
    await sendMail(options)
    await user.save();

    res.status(200).json({
        status: 'success',
        msg: 'Account found successfully, verification code send successfully.',
    })
})

// @desc     Verify verification code to reset password
// @route    /verify-code
// @access   Public
exports.verifyVerificationCode = asyncHandler(async (req, res, next) => {
    //Check if account exist first by email address
    const user = await UserModel.findOne({
        email: req.body.email,
        verificationCodeExp: {
            $gt: Date.now()
        }
    })
    if (!user) {
        throw new ApiError("invalid verification code or expired", 400)
    }

    const enterVerificationCodeHashed = crypt(req.body.code.toString())

    if (enterVerificationCodeHashed !== user.verificationCodeHashed) {
        throw new ApiError("invalid verification code", 400)
    }

    user.verificationCodeDone = true;
    user.save()
    res.status(200).json({
        status: "success",
        msg: "verifications successfully, add new password now",
    })
})

// @desc     Verify verification code to reset password
// @route    /reset-password
// @access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {


    const user = await UserModel.findOneAndUpdate(
        {
            email: req.body.email, verificationCodeExp: {
                $gt: Date.now()
            }
        },
        {
            password: req.body.password,
        }, { new: true })

    if (!user.verificationCodeDone) {
        throw new ApiError("Verify Verification code first", 400)
    }

    if (!user) {
        throw new ApiError("Invalid verification expired", 400)
    }




    const token = jwt.sign({ id: user._id }, 'shop-e-token-p-key', {
        expiresIn: '2d',
    })

    const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    };


    user.verificationCodeDone = undefined;
    user.verificationCodeHashed = undefined;
    user.verificationCodeExp = undefined;
    await user.save()
    res.status(200).json(
        {
            status: "update password successfully",
            data: data,

        }
    )

})