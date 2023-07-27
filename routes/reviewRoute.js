const express = require('express');

const { createReview, updatereview, deleteReview, getAllReview, getReviewById } = require('../services/reviewService')
const { createReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utils/validatorRules/reviewValidators')
const { proccess, userAccess } = require('../services/authService')

const router = express.Router({ mergeParams: true });


const setOptions = (needUserId) => (req, res, next) => {
    const filterOptions = {}
    if (req.params.productId) {
        filterOptions.product = req.params.productId
        req.body.product = req.params.productId
    }
    if (req.body.id) {
        req.params.id = req.body.id;
    }
    if (needUserId) {
        filterOptions.user = req.user._id.toString()
        req.body.user = filterOptions.user
    }

    req.filterOptions = filterOptions
    next();
}

router.route('/')
    .get(proccess, setOptions(false), getAllReview)
    .post(proccess, userAccess('user'), setOptions(true), createReviewValidator, createReview)
    .put(proccess, userAccess('user'), setOptions(true), updateReviewValidator, updatereview)

router.route('/:id')
    .get(proccess, getReviewById)
    .put(proccess, userAccess('user'), updateReviewValidator, updatereview)
    .delete(proccess, deleteReviewValidator, deleteReview)


module.exports = router;
