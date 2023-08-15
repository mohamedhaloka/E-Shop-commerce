
const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');
const ApiError = require('../utils/apiError');




exports.getAddresseslist = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    res.status(200).json({
        'status': 'success',
        'msg': 'fetch user addresses successfullty',
        'data': user.addresses
    })
})


exports.addNewAddress = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    const address = {
        title: req.body.title,
        description: req.body.description,
    };
    user.addresses.push(address)

    user.save();

    res.status(200).json({
        'status': 'success',
        'msg': 'address added successfully',
        'data': address
    })
})

exports.updateAddress = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    const address = {
        title: req.body.title,
        description: req.body.description,
    };
    const objIndex = user.addresses.findIndex((obj => obj.id === req.params.id));

    user.addresses[objIndex] = address

    user.save();

    res.status(200).json({
        'status': 'success',
        'msg': 'address updated successfully',
        'data': address
    })
})


exports.deleteAddress = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    if (!user.addresses.includes(req.params.id)) {
        throw new ApiError("address not found", 404);
    }

    const objIndex = user.addresses.findIndex((obj => obj._id === req.params.id));

    const newAddressList = user.addresses.slice(objIndex)

    user.save();

    res.status(200).json({
        'status': 'success',
        'msg': 'address upated successfully',
        'data': newAddressList
    })
})