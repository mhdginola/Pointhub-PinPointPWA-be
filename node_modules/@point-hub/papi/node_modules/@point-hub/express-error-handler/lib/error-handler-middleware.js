import { STATUS_CODES } from "http";
import { constants } from "http2";
import BaseError from "./base-error.js";
import { isTrustedError } from "./index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, next) {
    if (err instanceof BaseError && isTrustedError(err)) {
        const response = {
            code: err.httpCode,
            message: err.message,
        };
        if (err.info) {
            response.info = err.info;
        }
        res.status(err.httpCode).json(response);
        return next(err);
    }
    // Cannot handle error, return "INTERNAL SERVER ERROR"
    const response = {
        code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: STATUS_CODES[constants.HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
    next(err);
}
