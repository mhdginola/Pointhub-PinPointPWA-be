import ApiError from "./api-error.js";
export default class BadRequest extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
