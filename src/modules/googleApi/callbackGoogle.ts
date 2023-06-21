import passport from "passport";

export const callbackLoginWithGoogle = async () => {
  passport.authenticate("google", { failureRedirect: "/login" }),
    function (req: Request, res: Response, profile: any) {
      // Successful authentication, redirect home.
      console.log(profile);
      res.json();
    };
};
