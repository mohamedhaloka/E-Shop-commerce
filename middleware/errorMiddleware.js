

const errorHandlerDev = (error, res) => {
    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
        stack: error.stack,
    })
}

const errorHandlerProduction = (error, res) => {
    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
    })
}


const globalErrorMiddleware = (error, req, res, next) => {
    console.log(error.message);
    error.message = error.message || "Error"
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        errorHandlerDev(error, res)
    } else {
        errorHandlerProduction(error, res)
    }
}


module.exports = globalErrorMiddleware;