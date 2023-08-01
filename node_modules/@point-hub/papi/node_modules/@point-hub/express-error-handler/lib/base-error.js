export default class BaseError extends Error {
    constructor(message) {
        super(message);
    }
}
export const isTrustedError = (err) => {
    if (err instanceof BaseError) {
        return err.isOperational;
    }
    return false;
};
