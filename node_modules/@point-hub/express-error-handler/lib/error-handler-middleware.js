import BaseError from "./base-error.js";
import { isTrustedError } from "./index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, next) {
    if (err instanceof BaseError && isTrustedError(err)) {
        const response = {
            code: err.code,
            status: err.status,
            message: err.message,
        };
        if (err.errors) {
            response.errors = err.errors;
        }
        res.status(err.code).json(response);
        return next(err);
    }
    // Cannot handle error, return "INTERNAL SERVER ERROR"
    const response = {
        code: 500,
        status: "Internal Server Error",
        message: "Sorry something went wrong.",
    };
    res.status(500).json(response);
    next(err);
}
