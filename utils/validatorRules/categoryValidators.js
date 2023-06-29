
const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.getCategoryByIdValidator = [
    check('id').isMongoId().withMessage('Invalid id format'),
    validatorMiddleware
];


exports.createCategoryValidator = [
    check('name')
        .notEmpty().withMessage('Category name must be required')
        .isLength({ min: 4 }).withMessage('Categories must be greater than 4 char')
        .isLength({ max: 25 }).withMessage('Category must be smaller than 25 char')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true;
        }),
    // check('image')
    //     .notEmpty().withMessage('Category image is required'),
    validatorMiddleware
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id format'),
    validatorMiddleware
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id format'),
    check('name')
        .notEmpty().withMessage('Category name must be required')
        .isLength({ min: 4 }).withMessage('Categories must be greater than 4 char')
        .isLength({ max: 25 }).withMessage('Category must be smaller than 25 char'),
    body('name').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
];