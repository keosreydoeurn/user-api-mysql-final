class BaseController {
    successResponse(res, message, data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    errorResponse(res, message, statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message: message
        });
    }
}

export default BaseController;