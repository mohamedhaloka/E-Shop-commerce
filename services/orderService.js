const asyncHandler = require('express-async-handler');
const stripe = require('stripe')('sk_test_51NadxlKExyywEpm06ZPOyWiRQMzGN4eKBTiPMU6QiZZr5JXbAUvVjgss7stoRZoWeQLAQkVbsmyp9uR5rEd5wwpK00Ii8vO7Nb');

const ApiError = require('../utils/apiError');
const OrderModel = require('../models/orderModel')
const ProductModel = require('../models/productModel')
const CartModel = require('../models/cartModel')
const { getAllDocs, getDocById } = require('./handlerFactory')



exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    //1- Get cart depend on cartId
    const cart = await CartModel.findById(req.params.cartId)

    if (!cart) {
        return next(new ApiError('Cart not found', 404))
    }
    //2- Get order price depend on cart price
    const totalPrice = cart.totalProductsPriceWithDiscount ?
        cart.totalProductsPriceWithDiscount :
        cart.totalProductsPrice;

    const orderPrice = totalPrice + taxPrice + shippingPrice;
    //3- Create order
    const order = await OrderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: orderPrice,
        shippingAddress: req.body.shippingAddress,
    })
    if (!order) {
        return next(new ApiError('Error while creating order', 500))
    }
    //4- After creating order, decrement the quantity and sold from product 
    const bulkOptions = cart.cartItems.map(item => ({
        updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
    }))
    await ProductModel.bulkWrite(bulkOptions, {})
    //5- Clear the user cart
    await CartModel.findOneAndDelete(req.params.cartId)

    res.status(200).json({
        status: 'success',
        message: 'Order was created successfully',
        data: order,
    })
})

exports.getOrders = getAllDocs(OrderModel)

exports.getParticularOrderById = getDocById(OrderModel, 'user')


exports.changeOrderStatusToPaid = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id)

    if (!order) {
        return next(new ApiError('Order not found', 404))
    }

    order.isPaid = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save();

    res.status(200).json({
        status: 'success',
        message: 'Order paid status done successfully',
        data: updatedOrder
    })

})


exports.changeOrderStatusToDelevired = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id)

    if (!order) {
        return next(new ApiError('Order not found', 404))
    }

    order.isDelevired = true
    order.deleviredAt = Date.now()

    const updatedOrder = await order.save();

    res.status(200).json({
        status: 'success',
        message: 'Order delever status done successfully',
        data: updatedOrder
    })

})


exports.createPaymentUrl = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    //1- Get cart depend on cartId
    const cart = await CartModel.findById(req.params.cartId)

    if (!cart) {
        return next(new ApiError('Cart not found', 404))
    }
    //2- Get order price depend on cart price
    const totalPrice = cart.totalProductsPriceWithDiscount ?
        cart.totalProductsPriceWithDiscount :
        cart.totalProductsPrice;

    const orderPrice = totalPrice + taxPrice + shippingPrice;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                quantity: 1,
                price_data: {
                    product_data: {
                        name: `Cart ${cart._id}`,
                    },
                    currency: 'egp',
                    unit_amount: orderPrice * 100,
                },

            },
        ],
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        mode: 'payment',
        success_url: `https://www.google.com/success.html`,
        cancel_url: `https://www.google.com/cancel.html`,
    });

    res.status(303).json({
        status: 'success',
        message: 'Paymnet url created successfully',
        session,
    });

})

const createCreditOrder = async () => {
    console.log('createCreditOrder');
}

exports.webhook = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.SINGING_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    if (event === "checkout.session.completed") {
        createCreditOrder()
    }
})


