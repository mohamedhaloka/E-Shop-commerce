const express = require('express');
const { createSubCategory, updateSubCategory, deleteSubCategory, getSubCategoryById, getAllSubCategories } = require('../services/subCategoryServices')
const { createSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator, getSubCategoryByIdValidator, getAllSubCategoriesValidator } = require('../utils/validatorRules/subCategoryValidators')

const { proccess, userAccess } = require('../services/authService')

const router = express.Router({ mergeParams: true })

router.route('/')
    .post(proccess,
        userAccess('admin', 'manager'),
        createSubCategoryValidator,
        createSubCategory)
    .get(getAllSubCategoriesValidator,
        getAllSubCategories)

router.route('/:id')
    .patch(
        proccess,
        userAccess('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory)
    .delete(
        proccess,
        userAccess('admin', 'manager'),
        deleteSubCategoryValidator,
        deleteSubCategory)
    .get(getSubCategoryByIdValidator,
        getSubCategoryById)


module.exports = router