import { Request, Response } from "express";
import passport, { use } from "passport";
import { CreateUserRepository } from "../user/model/repository/create.repository.js";
import { RetrieveAllUserRepository } from "../user/model/repository/retrieve-all.repository.js";
import { issuer, secretKey } from "@src/config/auth.js";
import { db } from "@src/database/database.js";
import { signNewToken } from "@src/utils/jwt.js";

interface UserNew {
  [x: string]: any;
  id?: string;
  email?: string;
}

export const loginWithGoogle = passport.authenticate("google", { scope: ["email", "profile"] });

export const loginWithGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/v1/auth/",
  successRedirect: "/v1/auth/success",
});

export const loginWithGoogleSuccess = async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user: UserNew = req.user;
    if (user.id) {
      // upsert users
      const id: string = user.id;
      const session = db.startSession();
      const response = await new RetrieveAllUserRepository(db).handle(
        {
          filter: { google_id: id },
          fields: "",
          page: 0,
          pageSize: 0,
          sort: "",
        },
        { session }
      );
      if (response.data.length === 0) {
        const userRepository = new CreateUserRepository(db);
        const response = await userRepository.handle(
          { email: user.emails[0].value, username: user.emails[0].value, google_id: id, role: "admin" },
          { session }
        );
        const accessToken = signNewToken(issuer, secretKey, response._id);
        res.status(200).json({ accessToken: accessToken });
      } else {
        const accessToken = signNewToken(issuer, secretKey, response.data[0]._id);
        res.status(200).json({ accessToken: accessToken });
      }
    }
  } else {
    res.json({ isLoggedin: false });
  }
};
