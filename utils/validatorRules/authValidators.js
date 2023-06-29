const { check } = require('express-validator')

const { crypt } = require('../cryptHelper')

const validatorMiddleware = require('../../middleware/validatorMiddleware')

const UserModel = require('../../models/userModel')


exports.signUpValidtor = [
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
    check('role').optional().custom((role) => {
        if (role === 'admin') {
            throw new Error('you cannot add admin');
        }
    }),
    check('profImage').optional(),
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


exports.logInValidtor = [
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('You should write a valid email address')
        .custom((email) => UserModel.findOne({ email }).then((value) => {
            if (!value) {
                throw new Error('invalid creditionals')
            }
            return true;
        })),
    check('password').notEmpty().withMessage('password is required')
        .custom(async (password) => {
            const cryptedPassword = crypt(password);
            const user = await UserModel.findOne({ password: cryptedPassword })

            if (!user) {
                throw new Error('invalid creditionals')
            }

            return true;
        }),
    validatorMiddleware
]

exports.forgetPasswordValidtor = [
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('You should write a valid email address'),
    validatorMiddleware
]


