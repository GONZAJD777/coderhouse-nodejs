import { CustomError, NotFoundError, UnauthorizedError } from '../errors/custom.error.js';

const responseErrorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);

    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof UnauthorizedError) {
        return res.status(401).send({ status: 'error', code: err.code, message: err.message });
    } else if (err instanceof NotFoundError) {
        return res.status(404).send({ status: 'error', code: err.code, message: err.message });
    } else if (err instanceof CustomError) {
        return res.status(500).send({ status: 'error', code: err.code, message: err.message });
    }

    return res.status(500).send({ status: 'error', code: 90000, message: "Internal server error" });
};

export default responseErrorHandler;