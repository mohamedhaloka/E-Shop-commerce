const express = require('express');

const { signUp, logIn, forgetPassword } = require('../services/authService')
const { signUpValidtor, logInValidtor, forgetPasswordValidtor } = require('../utils/validatorRules/authValidators')

const router = express.Router();


router.post('/sign-up', signUpValidtor, signUp)
router.post('/log-in', logInValidtor, logIn)
router.post('/forget-password', forgetPasswordValidtor, forgetPassword)


module.exports = router