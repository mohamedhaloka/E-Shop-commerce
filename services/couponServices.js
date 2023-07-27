const CouponModel = require('../models/couponModel')
const { getAllDocs, getDocById, createDoc, updateOne, deleteOne } = require('./handlerFactory')



exports.createCoupon = createDoc(CouponModel)

exports.updateCoupon = updateOne(CouponModel)

exports.deleteCoupon = deleteOne(CouponModel)

exports.getCoupons = getAllDocs(CouponModel)

exports.getCoupon = getDocById(CouponModel)