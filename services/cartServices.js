
const asyncHandler = require('express-async-handler');
const CartModel = require('../models/cartModel')
const ProductModel = require('../models/productModel')


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
        // console.log('Cart Founded ', cart.cartItems.toString())
        //Calculate total price
        let total = 0;

        cart.cartItems.forEach(item => {
            total += item.price * item.quantity;
        })
        cart.totalProductsPrice = total;

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

    res.status(200).json({
        status: "success",
        message: "Fetch cart data successfully",
        cart: cart,
    })
})
