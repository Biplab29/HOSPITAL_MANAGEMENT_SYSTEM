class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue).join(", ");
      err.message = `Duplicate field value entered: ${field}`;
      err.statusCode = 400;
    }
  
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
      err.message = "JSON Web Token is invalid, try again!";
      err.statusCode = 401;
    }
  
    if (err.name === "TokenExpiredError") {
      err.message = "JSON Web Token has expired, please login again!";
      err.statusCode = 401;
    }
  
    // Handle Mongoose cast error (invalid ObjectId, etc.)
    if (err.name === "CastError") {
      err.message = `Invalid value for ${err.path}`;
      err.statusCode = 400;
    }
  
    // Handle Mongoose validation errors clearly
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    } 
    // Generic error response
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  export default ErrorHandler;
  