const { check } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');

const ReviewModel = require('../../models/reviewModel')
const ApiError = require('../apiError')



exports.createReviewValidator = [
    check('title').optional(),
    check('rating').notEmpty()
        .withMessage('Rating is required')
        .isFloat({ min: 1, max: 5 }).withMessage('The min rating is 1 and max is 5'),
    check('user').notEmpty()
        .withMessage('User is required')
        .isMongoId().withMessage('Please add valid user id'),
    check('product')
        .notEmpty().withMessage('Product is required')
        .isMongoId().withMessage('Please add valid product id').custom(async (value, { req }) => {
            const review = await ReviewModel.findOne({ product: value, user: req.user._id.toString() })
            if (review) {
                throw new ApiError("Rating for product is found already, you cannot add another review for the same product but you can edit it", 404)
            }
            return true;
        }),
    validatorMiddleware
]


exports.updateReviewValidator = [
    check('id').notEmpty().withMessage('Id is required')
        .custom(async (id, { req }) => {
            const review = await ReviewModel.findById(id)

            if (!review) {
                throw new ApiError("Review not found", 404)

            }

            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new ApiError("This review not for you", 404)
            }
            return true;
        }),
    check('title').optional(),
    check('rating').optional()
        .isFloat({ min: 1, max: 5 }).withMessage('The min rating is 1 and max is 5'),
    check('user').optional()
        .isMongoId().withMessage('Please add valid user id'),
    check('product')
        .optional()
        .isMongoId().withMessage('Please add valid product id'),
    validatorMiddleware
]

exports.deleteReviewValidator = [
    check('id').notEmpty().withMessage('Id is required')
        .custom(async (id, { req }) => {
            if (req.user.role.toString() !== 'user') return true;

            const review = await ReviewModel.findById(id)

            if (!review) {
                throw new ApiError("Review not found", 404)

            }

            if (review.user._id.toString() !== req.user._id) {
                throw new ApiError("This request not for you", 404)
            }
            return true;
        }),
    check('title').optional(),
    check('rating').notEmpty()
        .withMessage('Rating is required')
        .isFloat({ min: 1, max: 5 }).withMessage('The min rating is 1 and max is 5'),
    check('user').optional()
        .isMongoId().withMessage('Please add valid user id'),
    check('product')
        .optional()
        .isMongoId().withMessage('Please add valid product id'),
    validatorMiddleware
]

