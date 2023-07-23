/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError, find } from "@point-hub/express-error-handler";
export default class MongoError extends BaseError {
    constructor(err) {
        let error = find(400);
        if (err.code === 121) {
            // handle schema validation error
            error.errors = {};
            const errorMessage = err.errInfo?.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied;
            errorMessage.forEach((element) => {
                const obj = {};
                obj[element.propertyName] = [element.details[0].reason];
                error.errors = obj;
            });
        }
        else if (err.code === 11000) {
            if (!error) {
                error = {};
            }
            error.code = 422;
            error.status = "Unprocessable Entity";
            error.message = "The request was well-formed but was unable to be followed due to semantic errors.";
            // handle unique validation
            if (Object.keys(err.keyPattern).length === 1) {
                error.errors = {
                    [Object.keys(err.keyPattern)[0]]: [`${Object.keys(err.keyPattern)[0]} must be unique`],
                };
            }
            else {
                // get keys
                const keys = Object.keys(err.keyPattern).reduce((keys, key, index) => {
                    if (index === 0) {
                        keys += `'`;
                    }
                    keys += `${key.toString()}`;
                    if (index === Object.keys(err.keyPattern).length - 1) {
                        keys += `'`;
                    }
                    else {
                        keys += `, `;
                    }
                    return keys;
                }, "");
                // generate error object
                const obj = Object.keys(err.keyPattern).reduce((obj, key) => {
                    obj[key] = [`The combination of ${keys.toString()} is exists`];
                    return obj;
                }, {});
                error.errors = obj;
            }
        }
        super(error);
    }
    get isOperational() {
        return true;
    }
}
