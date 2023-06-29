
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith(4) ? 'fail' : 'error';
    }
}

module.exports = ApiError