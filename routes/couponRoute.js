const express = require('express');

const { getCoupon, getCoupons, deleteCoupon, createCoupon, updateCoupon } = require('../services/couponServices')
const { proccess, userAccess } = require('../services/authService')

const router = express.Router();

router.use(proccess, userAccess('admin', 'manager'))

router.route('/')
    .get(getCoupons)
    .post(createCoupon);

router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon)

module.exports = router;

