import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
const port = 3000;

dotenv.config();

// Konfigurasi Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: "160801539479-147jshv55s8esq0ps42mnpu3l61trmk1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Konfigurasi serialisasi dan deserialisasi pengguna
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("<a href='auth/google'>Sign in</a>");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate(
    "google",
    {
      failureRedirect: "/auth/google/failure",
    },
    (req, res, profile) => {
      // Redirect or handle successful authentication
      res.json(profile);
    }
  )
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
