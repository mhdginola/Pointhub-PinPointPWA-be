export default abstract class BaseError extends Error {
    info?: object;
    constructor(message: string);
    abstract get httpCode(): number;
    abstract get isOperational(): boolean;
}
export declare const isTrustedError: (err: Error) => boolean;
