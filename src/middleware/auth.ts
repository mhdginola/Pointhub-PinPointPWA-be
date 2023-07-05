
import { secretKey } from "../config/auth.js";
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@point-hub/express-error-handler';
import {  verifyToken } from "../utils/jwt.js";
import { retrieve } from "@src/test/utils.js";
 
async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authorization: any = verifyToken(authorizationHeader.split(" ")[1], secretKey);

    const user = await retrieve("users", authorization.sub);
    
    if(!user) {
      throw new ApiError(401);
    }

    if(!user?.role) {
      throw new ApiError(403);
    }
 
    next();
  } catch (error) {
    next(error);
  }
}

export default auth