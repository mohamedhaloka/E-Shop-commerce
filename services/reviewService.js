
const { createDoc, deleteOne, updateOne, getAllDocs, getDocById } = require('./handlerFactory')

const ReviewModel = require('../models/reviewModel')


// @desc    Create a new Review
// @route   [POST]/reviews/
// @access  Private
exports.createReview = createDoc(ReviewModel)

// @desc    Update existing Review
// @route   [PUT]/reviews/:id
// @access  Private
exports.updatereview = updateOne(ReviewModel)

// @desc    delete existing Review
// @route   [DEL]/reviews/:id
// @access  Private
exports.deleteReview = deleteOne(ReviewModel)

// @desc    Get all reviews
// @route   [GET]/reviews/
// @access  Private
exports.getAllReview = getAllDocs(ReviewModel)

// @desc    Get exisitng review
// @route   [GET]/reviews/:id
// @access  Private
exports.getReviewById = getDocById(ReviewModel)