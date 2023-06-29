const express = require('express');

const { resizeImage, uploadBrandImage, createBrand, updateBrand, deleteBrand, getBrands, getBrand } = require('../services/brandServices')
const { createBrandValidator, updateBrandValidator, deleteBrandValidator, getBrandValidator } = require('../utils/validatorRules/brandValidators')

const router = express.Router();

router.route('/')
    .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand)
    .get(getBrands)

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .patch(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;