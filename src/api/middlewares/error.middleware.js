const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
    });
};

export { globalErrorHandler };
