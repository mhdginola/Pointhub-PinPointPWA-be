import ApiError from "./api-error.js";
export default class TooManyRequest extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
