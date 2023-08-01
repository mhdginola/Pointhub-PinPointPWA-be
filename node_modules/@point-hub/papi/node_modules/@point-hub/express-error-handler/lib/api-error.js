import BaseError from "./base-error.js";
export default class ApiError extends BaseError {
    constructor(message) {
        super(message);
    }
    get isOperational() {
        return true;
    }
}
