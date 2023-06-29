const express = require('express');

const { updateUserPassword, uploadProfImage, resizeImage, updateUser, createUser, deleteUser, getAllUsers, getUserById } = require('../services/userServices')
const { createUserValidtor, updateUserPasswordValidators } = require('../utils/validatorRules/userValidators')

const { proccess, userAccess } = require('../services/authService')

const router = express.Router()

router.patch('/changePassword/:id',
    updateUserPasswordValidators,
    updateUserPassword)

router.route('/')
    .get(proccess,
        userAccess('admin', 'manager'),
        getAllUsers)
    .post(proccess,
        userAccess('admin', 'manager'),
        uploadProfImage,
        resizeImage,
        createUserValidtor,
        createUser)


router.route('/:id')
    .delete(proccess,
        userAccess('admin', 'manager'),
        deleteUser)
    .patch(proccess,
        userAccess('admin', 'manager'),
        uploadProfImage,
        resizeImage,
        updateUser)
    .get(proccess,
        userAccess('admin', 'manager'),
        getUserById)

module.exports = router;