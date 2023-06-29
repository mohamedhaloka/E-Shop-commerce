const SubCategoryModel = require('../models/subCategoryModel')
const { getAllDocs, getDocById, createDoc, deleteOne, updateOne } = require('./handlerFactory');

exports.createSubCategory = createDoc(SubCategoryModel)

exports.updateSubCategory = updateOne(SubCategoryModel)

exports.deleteSubCategory = deleteOne(SubCategoryModel)

exports.getSubCategoryById = getDocById(SubCategoryModel)

exports.getAllSubCategories = getAllDocs(SubCategoryModel)