
const express = require('express')

const { getCategoryByIdValidator, deleteCategoryValidator, updateCategoryValidator, createCategoryValidator } = require('../utils/validatorRules/categoryValidators');

const { resizeImage, uploadCategoryFile, getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } = require('../services/categoryServices')

const { proccess, userAccess } = require('../services/authService')
const subCategoriesRoute = require('./subCategoryRoute')

const router = express.Router();

router.route('/')
    .get(proccess, getCategories)
    .post(proccess, userAccess('admin', 'manager'), uploadCategoryFile, resizeImage, createCategoryValidator, createCategory)

router.route('/:id')
    .get(proccess, getCategoryByIdValidator, getCategoryById)
    .patch(proccess, userAccess('admin', 'manager'), updateCategoryValidator, updateCategory)
    .delete(proccess, userAccess('admin', 'manager'), deleteCategoryValidator, deleteCategory)


router.use('/:categoryId/subCategories', subCategoriesRoute)

//EQUAL => 
// router.get('/', getCategories)
// router.post('/', createCategories)

module.exports = router;