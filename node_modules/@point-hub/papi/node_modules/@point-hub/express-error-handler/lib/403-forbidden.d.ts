import ApiError from "./api-error.js";
export default class Forbidden extends ApiError {
    constructor(message?: string);
    get httpCode(): number;
}
