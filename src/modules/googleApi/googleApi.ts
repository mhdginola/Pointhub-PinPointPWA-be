import { Request, Response } from "express";
import passport from "passport";
import { issuer, secretKey } from "@src/config/auth.js";
import { signNewToken } from "@src/utils/jwt.js";

interface UserNew {
  id?: string;
  email?: string;
}

export const loginWithGoogle = passport.authenticate("google", { scope: ["email", "profile"] });

export const loginWithGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/v1/auth/",
  successRedirect: "/v1/auth/success",
});

export const loginWithGoogleSuccess = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user: UserNew = req.user;
    if (user.id) {
      const id: string = user.id;
      const accessToken = signNewToken(issuer, secretKey, id);
      res.status(200).json({ accessToken: accessToken });
    }
  }
  res.json({ isLoggedin: false });
};
