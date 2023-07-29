const express = require('express');

const { getLoggedUserCartData, addProductToCart, removeSpecificCartItem, clearLoggedUserCard, updateCartItemQuantity, applyCouponInCart, removeCouponFromCart } = require('../services/cartServices')
const { proccess, userAccess } = require('../services/authService')

const router = express.Router();

router.use(proccess, userAccess('user'))

router.route('/')
    .get(getLoggedUserCartData)
    .post(addProductToCart)
    .delete(clearLoggedUserCard)

router.route('/applyCoupon')
    .post(applyCouponInCart)

router.route('/removeCoupon')
    .post(removeCouponFromCart)

router.route('/:id')
    .delete(removeSpecificCartItem)
    .post(updateCartItemQuantity)



module.exports = router;