const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')

const UserModel = require('../models/userModel')
const ApiError = require('../utils/apiError')
const { crypt } = require('../utils/cryptHelper');

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
    const user = await UserModel.findOne({ email: req.body.email, password: req.body.password, });


    if (!user) {
        throw new ApiError('User not found', 404)
    }

    const token = jwt.sign({ id: user._id }, this.proccess.env.TOKEN_PRIVATE_KEY, {
        expiresIn: this.proccess.env.EXPIRES_IN,
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
        throw new ApiError('authorization to use this route, you should add token', 401)
    }
    const token = authorization.split(' ')[1]
    console.log(token);

    //2) Verify token if exist
    const decodedData = jwt.verify(token, this.proccess.env.TOKEN_PRIVATE_KEY)
    const userId = decodedData.id

    //3) Check if user exists
    const user = await UserModel.findById(userId)

    if (!user) {
        throw new ApiError('user not found', 401)
    }

    //4) Check if use change the password after token created

    if ((user.passwordChangedAt.getTime() / 1000) > decodedData.iat) {
        throw new ApiError('you change password, please login again', 401)
    }

    req.user = user
    next();
})

// @desc     Check the accessbility of the user
exports.userAccess = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.contain(req.user.role)) {
        throw new ApiError("this permission for admin only", 500)
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
    const verificationCodeExpDate = Date.now() + 10 * 60 * 1000;
    user.verificationCodeExpDate = verificationCodeExpDate

    user.verificationCodeDone = false

    //Send email

    next()
})