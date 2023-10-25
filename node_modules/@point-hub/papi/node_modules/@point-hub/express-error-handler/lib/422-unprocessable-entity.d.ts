import ApiError from "./api-error.js";
export default class UnprocessableEntity extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
