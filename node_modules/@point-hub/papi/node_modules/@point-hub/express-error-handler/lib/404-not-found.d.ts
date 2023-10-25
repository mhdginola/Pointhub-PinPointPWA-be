import ApiError from "./api-error.js";
export default class NotFound extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
