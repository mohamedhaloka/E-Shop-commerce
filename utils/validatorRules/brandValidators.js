const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');



exports.createBrandValidator = [
    check('name').notEmpty().withMessage('name of brand is required').isLength({ max: 20 }).withMessage('max length of name is 20 char'),
    body('name').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
]

exports.updateBrandValidator = [
    check('name').notEmpty().withMessage('name of brand is required').isLength({ max: 20 }).withMessage('max length of name is 20 char'),
    check('id').isMongoId().withMessage('should write valid brand id'),
    body('name').custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true;
    }),
    validatorMiddleware
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('should write valid brand id'),
    validatorMiddleware
]

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('should write valid brand id'),
    validatorMiddleware
]