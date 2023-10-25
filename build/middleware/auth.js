import { ApiError } from "@point-hub/express-error-handler";
import { secretKey } from "../config/auth.js";
import { verifyToken } from "../utils/jwt.js";
import { retrieve } from "../test/utils.js";
async function auth(req, res, next) {
    try {
        const allowedRoles = ["employee", "admin"];
        const authorizationHeader = req.headers.authorization ?? "";
        if (authorizationHeader === "") {
            throw new ApiError(401);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authorization = verifyToken(authorizationHeader.split(" ")[1], secretKey);
        const user = await retrieve("users", authorization.sub);
        if (!user) {
            throw new ApiError(401);
        }
        if (!user?.role || !allowedRoles.includes(user?.role)) {
            throw new ApiError(403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
export default auth;
