const express = require('express');

const { getLoggedUserCartData, addProductToCart } = require('../services/cartServices')
const { proccess, userAccess } = require('../services/authService')

const router = express.Router();

router.use(proccess, userAccess('user'))

router.route('/')
    .get(getLoggedUserCartData)
    .post(addProductToCart)


module.exports = router;