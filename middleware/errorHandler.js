const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch(statusCode) {
        case 200:
            // Handle 200 OK response
            res.status(200).json({
                title: "OK",
                message: "Request successful",
                data: res.locals.data,
            });
            break;
        case 400:
            res.status(400).json({
                title: "Bad Request",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 500:
        default:
            console.error("Unhandled error:", err);
            res.status(500).json({
                title: "Internal Server Error",
                message: "Something went wrong!",
                stackTrace: err.stack,
            });
            break;
    }
};

module.exports = errorHandler;