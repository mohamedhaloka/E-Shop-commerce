
const asyncHandler = require('express-async-handler');
const CartModel = require('../models/cartModel')
const ProductModel = require('../models/productModel')
const CouponModel = require('../models/couponModel')

const ApiError = require('../utils/apiError')


const calculateTotalPrice = (cart) => {
    let total = 0;
    cart.cartItems.forEach(item => {
        total += item.price * item.quantity;
    })
    cart.totalProductsPrice = total;
}

exports.addProductToCart = asyncHandler(async (req, res, next) => {

    const { productId, color } = req.body
    const product = await ProductModel.findById(productId);
    let cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        // Cart is empty, you should create one with product
        console.log(color);
        cart = await CartModel.create({
            cartItems: [{
                product: productId,
                color: color,
                price: product.price,
            }],
            user: req.user._id,
        })
    } else {
        const productIndex = cart.cartItems
            .findIndex(item => item.product.toString() === productId && item.color.toString() === color)
        // product is exist with same id and color, update product quantity
        if (productIndex !== -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem
            console.log(cartItem);
        } else {
            cart.cartItems.push({
                product: productId,
                color: color,
                price: product.price,
            })
        }
        //Calculate total price
        calculateTotalPrice(cart)

        await cart.save()

        res.status(200).json({
            status: "success",
            message: "Add product to cart successfully",
            cart: cart,
        })
    }
})


exports.getLoggedUserCartData = asyncHandler(async (req, res, next) => {

    const cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    res.status(200).json({
        status: "success",
        message: "Fetch cart data successfully",
        cart,
    })
})


exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {

    const itemId = req.params.id;
    let cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    cart = await CartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { _id: itemId } } },
        { new: true }
    )

    calculateTotalPrice(cart)
    await cart.save();


    res.status(200).json({
        status: "success",
        message: "Remove item from cart successfully",
        cart,
    })
})


exports.clearLoggedUserCard = asyncHandler(async (req, res, next) => {

    const cart = await CartModel.findOneAndRemove({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    res.status(200).json({
        status: "success",
        message: "Remove cart successfully",
    })
})

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {

    const itemId = req.params.id;
    const { quantity } = req.body;
    const cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    const productIndex = cart.cartItems.findIndex(item => item._id.toString() === itemId)

    if (productIndex === -1) {
        return next(new ApiError("Cart item not found", 404))
    }

    const cartItem = cart.cartItems[productIndex]
    cartItem.quantity = quantity;
    cart.cartItems[productIndex] = cartItem;

    calculateTotalPrice(cart)
    await cart.save();


    res.status(200).json({
        status: "success",
        message: "Update item in cart successfully",
        cart,
    })
})

exports.applyCouponInCart = asyncHandler(async (req, res, next) => {

    const cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    const coupon = await CouponModel.findOne({ name: req.body.couponName })

    if (!coupon) {
        return next(new ApiError("No coupon exist", 404))
    }

    if (coupon.expiryDate.getTime() < Date.now()) {
        return next(new ApiError("Coupon is expired", 404))
    }

    if (coupon.isPrecentage) {
        cart.totalProductsPriceWithDiscount = cart.totalProductsPrice - cart.totalProductsPrice * (coupon.discount / 100)
    } else {
        cart.totalProductsPriceWithDiscount = cart.totalProductsPrice - coupon.discount;
    }

    cart.save();
    res.status(200).json({
        status: "success",
        message: "Apply coupon successfully",
        cart,
    })
})

exports.removeCouponFromCart = asyncHandler(async (req, res, next) => {

    const cart = await CartModel.findOne({ user: req.user._id })

    if (!cart) {
        return next(new ApiError("Cart not found", 404))
    }

    cart.totalProductsPriceWithDiscount = undefined

    cart.save();
    res.status(200).json({
        status: "success",
        message: "Remove coupon successfully",
        cart,
    })
})