const express = require('express');

const { updateUserPassword,
    uploadProfImage,
    resizeImage,
    updateUser,
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    getLoggedUserData,
    updateLoggedUserData,
    updateLoggedUserPassword,
    deactiveLoggedUserAccount } = require('../services/userServices')

const { getWashlist, toggleFromWashlist } = require('../services/washlistService')

const { getAddresseslist, addNewAddress, updateAddress, deleteAddress } = require('../services/addressesService')

const { createUserValidtor, updateUserPasswordValidators, updateLoggedUserPasswordValidators } = require('../utils/validatorRules/userValidators')

const { proccess, userAccess } = require('../services/authService')

const router = express.Router()

router.patch('/changePassword/:id',
    updateUserPasswordValidators,
    updateUserPassword)


router.get('/getLoggedUserData', proccess, getLoggedUserData)
router.put('/updateLoggedUserData', proccess, uploadProfImage,
    resizeImage, updateLoggedUserData)
router.put('/updateLoggedUserPassword', proccess, updateLoggedUserPasswordValidators, updateLoggedUserPassword)
router.put('/deactiveLoggedUserAccount', proccess, deactiveLoggedUserAccount)

router.route('/addressess')
    .get(proccess, getAddresseslist)
    .post(proccess, addNewAddress)

router.route('/addressess/:id')
    .put(proccess, updateAddress)
    .delete(proccess, deleteAddress)

router.route('/washlist').get(proccess, getWashlist).post(proccess, toggleFromWashlist)


router.route('/')
    .get(proccess,
        userAccess('admin', 'manager'),
        getAllUsers)
    .post(
        // proccess,
        // userAccess('admin', 'manager'),
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