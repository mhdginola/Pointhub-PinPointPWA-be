import ApiError from "./api-error.js";
export default class Unauthorized extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
