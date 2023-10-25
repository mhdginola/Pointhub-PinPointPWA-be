import BaseError from "./base-error.js";
import { find } from "./http-status.js";
export default class ApiError extends BaseError {
    constructor(codeStatus, errors) {
        const status = find(codeStatus);
        if (!status) {
            throw new Error(`Error codeStatus "${codeStatus}" not found`);
        }
        const error = status;
        if (errors) {
            error.errors = errors;
        }
        super(error);
    }
    get isOperational() {
        return true;
    }
}
