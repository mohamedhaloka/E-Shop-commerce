const express = require('express');

const { signUp, logIn, forgetPassword, verifyVerificationCode, resetPassword } = require('../services/authService')
const { signUpValidtor, logInValidtor, forgetPasswordValidtor } = require('../utils/validatorRules/authValidators')

const router = express.Router();


router.post('/sign-up', signUpValidtor, signUp)
router.post('/log-in', logInValidtor, logIn)

router.post('/forget-password', forgetPasswordValidtor, forgetPassword)
router.post('/verify-code', verifyVerificationCode)
router.post('/reset-password', resetPassword)

module.exports = router