const asyncHandler = require('express-async-handler')
const APIFeatures = require("../utils/apiFeatures")


exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return res.status(404).json({
            success: "error",
            message: `Item not found for id: ${req.params.id}`
        });
    }

    res.status(200).json({
        success: "success",
        message: "Item deleted successfully"
    });
})


exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!doc) {
        return res.status(404).json({
            success: "error",
            message: `Item not found for id: ${req.params.id}`
        });
    }

    res.status(200).json({
        success: "success",
        message: 'item updated successfully',
        data: doc
    });

})


exports.createDoc = (Model) => asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        success: "success",
        message: "Item created successfully",
        data: doc
    });

})

exports.getAllDocs = (Model, modelName) => asyncHandler(async (req, res, next) => {
    const totalRecords = await Model.countDocuments({});
    const { mongoseQuery, pagination } = new APIFeatures(Model.find(req.filterOptions), req.query)
        .pagination(totalRecords)
        .filter()
        .search(modelName)
        .limitFields()
        .sort();
    const docs = await mongoseQuery;

    res.status(200).json({
        success: "success",
        pagination: pagination,
        data: docs
    });
})

exports.getDocById = (Model, populateData) => asyncHandler(async (req, res, next) => {
    const item = await Model.findById(req.params.id)

    // if (populateData) {
    //     item.populate(populateData)
    // }
    // await item;
    // .populate('reviews');
    //.populate({ path: 'category', select: '-__v -slug' })
    // .populate({ path: 'subCategory', select: '-__v -slug' })
    // .populate({ path: 'brand', select: '-__v -slug -updatedAt' })

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        })
    }

    res.status(200).json({
        success: "success",
        message: 'item fetched successfully',
        data: item
    })

})