import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
// https://github.com/mikeerickson/validatorjs
export const validate = (documents) => {
    try {
        const examples = {
            example: [...documents],
        };
        const validation = new Validatorjs(examples, {
            "example.*.name": "required",
            "example.*.firstName": "required",
            "example.*.lastName": "required",
        });
        if (validation.fails()) {
            throw new ApiError(422, validation.errors.errors);
        }
    }
    catch (error) {
        throw error;
    }
};
