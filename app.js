const express = require('express');
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectLivereload = require("connect-livereload");
const path = require("path");
const livereload = require("livereload");
const cors = require('cors')
const compression = require('compression')

const dbConnection = require('./config/database');
const ApiError = require('./utils/apiError')
const globalError = require('./middleware/errorMiddleware')

const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const reviewRoute = require('./routes/reviewRoute');
const couponRoute = require('./routes/couponRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const { webhook } = require('./services/orderService');

const app = express()

dotenv.config({ path: "config.env" })


app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(cors())
app.options('*', cors()) // include before other routes

app.use(compression())

app.post('/checkout-webhook', express.raw({ type: 'application/json' }), webhook)

//for auto refresh
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


//connect with my database
dbConnection();

//Middleware
app.use(express.json())
app.use(express.static('upload'))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/subCategories', subCategoryRoute)
app.use('/api/v1/brands', brandRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/coupons', couponRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)

//Whatever not the valid route use this Middleware
app.all('*', (req, res, next) => {
  next(new ApiError(`Wrong route [${req.method}] ${req.originalUrl}, try another one`, 400))
})

//Error Handler Middleware
app.use(globalError)

const port = process.env.PORT

const server = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

process.on('unhandledRejection', (e) => {
  console.error(`Error occured ${e}`)
  server.close(() => {
    console.error(`Shutting down ...`)
    process.exit(1)
  })
})