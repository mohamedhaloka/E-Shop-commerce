const express = require('express');
const { resizeProductImage,
    uploadProductImage,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    checkUpdatePRoductBodyIsEmpty,
    getProducts } = require('../services/productService')
const { createProductValidor,
    updateProductValidator,
    deleteProductValidator,
    getProductByIdValidator } = require('../utils/validatorRules/productValidator')

const reviewsRoute = require('./reviewRoute')

const { proccess, userAccess } = require('../services/authService')

const router = express.Router();

router.use('/:productId/reviews', reviewsRoute)

router.route('/')
    .get(getProducts)
    .post(
        proccess, userAccess('admin', 'manger'),
        uploadProductImage,
        resizeProductImage,
        createProductValidor,
        createProduct)

router.route('/:id')
    .get(getProductByIdValidator,
        getProductById)
    .patch(
        proccess,
        userAccess('admin', 'manger'),
        uploadProductImage,
        resizeProductImage,
        checkUpdatePRoductBodyIsEmpty,
        updateProductValidator,
        updateProduct
    )
    .delete(proccess,
        userAccess('admin', 'manger'),
        deleteProductValidator,
        deleteProduct)

module.exports = router;