import { CustomError, NotFoundError, UnauthorizedError,BadRequestError } from '../errors/custom.error.js';
import { logger } from '../config/logger.config.js';

const responseErrorHandler = (err, req, res, next) => {
    logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + err);

    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof BadRequestError) {
        return res.status(400).send({ status: 'error', code: err.code, message: err.message });
    } else if (err instanceof UnauthorizedError) {
        return res.status(401).send({ status: 'error', code: err.code, message: err.message });
    } else if (err instanceof NotFoundError) {
        return res.status(404).send({ status: 'error', code: err.code, message: err.message });
    } else if (err instanceof CustomError) {
        return res.status(500).send({ status: 'error', code: err.code, message: err.message });
    }

    return res.status(500).send({ status: 'error', code: 90000, message: "Internal server error" });
};

export default responseErrorHandler;