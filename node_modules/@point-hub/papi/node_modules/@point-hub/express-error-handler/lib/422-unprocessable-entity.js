import { STATUS_CODES } from "http";
import { constants } from "http2";
import ApiError from "./api-error.js";
export default class UnprocessableEntity extends ApiError {
    constructor(message = STATUS_CODES[constants.HTTP_STATUS_UNPROCESSABLE_ENTITY]) {
        super(message);
    }
    get httpCode() {
        return constants.HTTP_STATUS_UNPROCESSABLE_ENTITY;
    }
}
