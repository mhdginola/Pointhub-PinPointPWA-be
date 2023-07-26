import { ApiError } from "@point-hub/express-error-handler";
import { Request, Response, NextFunction } from "express";
import { secretKey } from "../config/auth.js";
import { verifyToken } from "../utils/jwt.js";
import { retrieve } from "@src/test/utils.js";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authorization: any = verifyToken(authorizationHeader.split(" ")[1], secretKey);

    const user = await retrieve("users", authorization.sub);

    if (!user) {
      throw new ApiError(401);
    }

    if (!user?.role) {
      throw new ApiError(403);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
