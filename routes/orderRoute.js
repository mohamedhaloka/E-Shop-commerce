const express = require('express');

const { proccess, userAccess } = require('../services/authService')
const { createCashOrder, getParticularOrderById, getOrders, changeOrderStatusToDelevired, changeOrderStatusToPaid, createPaymentUrl } = require('../services/orderService')


const router = express.Router();

//User Routes
router.route('/:cartId')
    .post(proccess,
        userAccess('user'),
        createCashOrder)

router.route('/loggedUserOrders')
    .get(proccess, userAccess('user'), (req, res, next) => {
        req.filterOptions = {
            user: req.user._id
        };
        next()
    }, getOrders)


router.route('/orderDetails/:id')
    .get(proccess,
        userAccess('user'),
        getParticularOrderById)

router.route('/createPaymentUrl/:cartId')
    .post(proccess,
        userAccess('user'),
        createPaymentUrl)


// Admin Routes
router.route('/')
    .get(proccess,
        userAccess('admin', 'manager'),
        getOrders)

router.route('/:id')
    .get(proccess,
        userAccess('admin', 'manager'),
        getParticularOrderById,
    )

router.route('/:id/paid')
    .put(proccess,
        userAccess('admin', 'manager'),
        changeOrderStatusToPaid,
    )

router.route('/:id/deliver')
    .put(proccess,
        userAccess('admin', 'manager'),
        changeOrderStatusToDelevired,
    )



module.exports = router;