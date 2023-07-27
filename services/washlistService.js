
const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');




exports.getWashlist = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)
        .populate({ path: 'washlist', select: 'title description imageCover ratingAvarage' },)

    res.status(200).json({
        'status': 'success',
        'msg': 'fetch washlist successfullty',
        'data': user.washlist
    })
})


exports.toggleFromWashlist = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    let message = '';
    if (user.washlist.includes(req.body.productId)) {
        message = 'removed from washlist successfullty';
        user.washlist.pop(req.body.productId)
    } else {
        message = 'add to washlist successfullty';
        user.washlist.push(req.body.productId)
    }


    user.save();

    res.status(200).json({
        'status': 'success',
        'msg': message,
        'data': user.washlist
    })
})