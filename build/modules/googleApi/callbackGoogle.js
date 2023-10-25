import passport from "passport";
export const callbackLoginWithGoogle = async () => {
    passport.authenticate("google", { failureRedirect: "/login" }),
        function (req, res, profile) {
            // Successful authentication, redirect home.
            res.json();
        };
};
