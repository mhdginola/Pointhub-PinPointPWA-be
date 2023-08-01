import ApiError from "./api-error.js";
export default class MethodNotAllowed extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
