import { ApiError } from "./index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorNotFound(req, res, next) {
    next(new ApiError(404));
}
