import BaseError from "./base-error.js";
export default abstract class ApiError extends BaseError {
    constructor(message: string);
    abstract get httpCode(): number;
    get isOperational(): boolean;
}
