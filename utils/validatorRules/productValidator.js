
const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');

const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');
const BrandModel = require('../../models/brandModel');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createProductValidor = [
    check('title')
        .notEmpty().withMessage('Product title is required')
        .isLength({ min: 5 }).withMessage('Min product title length is 5 char')
        .isLength({ max: 100 }).withMessage('Max product title length is 100 char'),
    check('description')
        .notEmpty().withMessage('Product description is required')
        .isLength({ min: 20 }).withMessage('Min product description length is 20 char')
        .isLength({ max: 600 }).withMessage('Max product description length is 600 char'),
    check('quantity')
        .notEmpty().withMessage('Product quantity is required')
        .isNumeric().withMessage('Product quantity must be numeric'),
    check('solidTimes')
        .optional()
        .isNumeric().withMessage('solidTimes must be numeric'),
    check('price')
        .notEmpty().withMessage('Product quantity is required')
        .toFloat()
        .isNumeric().withMessage('Product quantity must be numeric')
        .isLength({ max: 200000 }).withMessage('to long price'),
    check('priceAfterDiscount')
        .optional()
        .notEmpty().withMessage('priceAfterDiscount is required')
        .isNumeric().withMessage('priceAfterDiscount must be numeric')
        .toFloat()
        .custom((value, { req }) => {
            if (value >= req.body.price) {
                throw new Error('priceAfterDiscount must be smaller than price')
            }
            return true;
        }),
    check('colors').optional().isArray().withMessage('Colors must be an array'),
    check('imageCover').notEmpty().withMessage('imageCover is required'),
    check('images').optional().isArray().withMessage('images must be an array'),
    check('category')
        .notEmpty().withMessage('category is required')
        .isMongoId().withMessage('you must add valid category id')
        .custom((categoryId) => CategoryModel.findById(categoryId).then((category) => {
            if (!category) {
                throw new Error('you must add valid category id')
            }
            return true;
        })),
    check('subCategory')
        .optional()
        .isMongoId().withMessage('you must add valid subCategory id')
        .custom((subCategoryId) => SubCategoryModel.findById(subCategoryId).then((subCategory) => {
            if (!subCategory) {
                throw new Error('you must add valid subCategory id')
            }
            return true;
        })).custom((subCategoryId, { req }) => SubCategoryModel.find({ categoryId: req.body.category })
            .then((subCategories) => {

                if (subCategories.length > 0) {
                    if (!subCategories.every((subCategory) => subCategory._id.toString() === subCategoryId.toString())) {
                        throw new Error('sub category id not belong to category id')
                    }
                } else {
                    throw new Error('sub category id not belong to category id')
                }
                return true
            })
        ),
    check('brand')
        .optional()
        .isMongoId().withMessage('you must add valid brand id')
        .custom((brandId) => BrandModel.findById(brandId).then((brand) => {
            if (!brand) {
                throw new Error('you must add valid brand id')
            }
            return true;
        })),
    check('ratingAvarage').optional().isNumeric().withMessage('ratingAvarage must be a number'),
    check('ratingQuantity').optional().isNumeric().withMessage('ratingQuantity must be a number'),
    body('title').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
]


exports.updateProductValidator = [
    check('id').isMongoId().withMessage('id must be valid'),
    body('title').custom((value, { req }) => {
        if (req.body.title) {
            req.body.slug = slugify(value)
        }
        return true;
    }),
    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('id must be valid'),
    validatorMiddleware
]

exports.getProductByIdValidator = [
    check('id').isMongoId().withMessage('id must be valid'),
    validatorMiddleware
]