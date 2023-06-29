const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createSubCategoryValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 4 }).withMessage("Min length of sub category is 4 characters")
        .isLength({ max: 35 }).withMessage("Max length of sub category is 35 characters"),
    check('categoryId').notEmpty().withMessage('Category ID is required').isMongoId().withMessage('You must add valid parent category id'),
    body('name').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
]

exports.getAllSubCategoriesValidator = [
    check('categoryId').notEmpty().withMessage('Category ID is required').isMongoId().withMessage('You must add valid parent category id'),
    validatorMiddleware
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('You must add valid id'),
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 4 }).withMessage("Min length of sub category is 4 characters").isLength({ max: 35 }).withMessage("Max length of sub category is 35 characters"),
    check('categoryId').notEmpty().withMessage('Category ID is required').isMongoId().withMessage('You must add valid parent category id'),
    body('name').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('You must add valid id'),
    validatorMiddleware
]

exports.getSubCategoryByIdValidator = [
    check('id').isMongoId().withMessage('You must add valid id'),
    validatorMiddleware
]