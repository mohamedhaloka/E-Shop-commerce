const { check } = require('express-validator')

const validatorMiddleware = require('../../middleware/validatorMiddleware')
const { crypt } = require("../cryptHelper")

const UserModel = require('../../models/userModel')


exports.createUserValidtor = [
    check('name')
        .notEmpty().withMessage('name is required'),
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('You should write a valid email address')
        .custom((email) => UserModel.findOne({ email }).then((value) => {
            if (value) {
                throw new Error('email already exists')
            }
            return true;
        })),
    check('password').notEmpty().withMessage('password is required'),
    check('role').optional(),
    check('profImage').optional(),
    check('phone').optional()
        .isMobilePhone('ar-EG').withMessage('Please enter a valid egyption phone number')
        .custom((phone) => UserModel.findOne({ phone }).then((value) => {
            if (value) {
                throw new Error('phone number already exists')
            }
            return true;
        })),
    check('passwordConfirmation')
        .notEmpty().withMessage('password confirmation is required')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('password confirmation does not match password')
            }
            return true;
        }),
    validatorMiddleware
]


exports.updateUserPasswordValidators = [
    check('id')
        .notEmpty().withMessage('Id is required')
        .isMongoId().withMessage('You should write a valid user id'),
    check('oldPassword')
        .notEmpty().withMessage('oldPassword is required'),
    check('confirmPassword')
        .notEmpty().withMessage('confirmPassword is required'),
    check('password')
        .notEmpty().withMessage('password is required')
        .custom(async (value, { req }) => {
            // Validate the old password equal the password in the db
            const user = await UserModel.findById(req.params.id)
            if (!user) {
                throw new Error('User not found')
            }

            const decryptUserPass = crypt(req.body.oldPassword)

            if (req.body.oldPassword === req.body.password || req.body.oldPassword === req.body.confirmPassword) {
                throw new Error('new password and confirm new password must be not equal old password')
            }

            if (user.password !== decryptUserPass) {
                throw new Error('old password is wrong')
            }

            if (value !== req.body.confirmPassword) {
                throw new Error('new password and confirm password does not match')
            }
            return true;
        }),
    validatorMiddleware
]