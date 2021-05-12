class ErrorResponse extends Error {
    constructor(message, statusCode) {
        console.log(message)
        super(message); // The rules for ES2015 (ES6) classes basically come down to: In a child class constructor, this cannot be used until super is called.
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
