import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";

dotenv.config();
type User = {
  id?: number;
  emails?: string;
};
// Konfigurasi Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: "160801539479-147jshv55s8esq0ps42mnpu3l61trmk1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/v1/auth/google/callback",
    },
    (accessToken: string, refreshToken: string, profile, done: VerifyCallback) => {
      // Callback setelah login berhasil
      // Lakukan operasi autentikasi atau registrasi pengguna di sini
      // Objek profile akan berisi informasi pengguna dari Google
      done(null, profile);
    }
  )
);

// Konfigurasi serialisasi dan deserialisasi pengguna
passport.serializeUser((user: User, done) => {
  const newUser: User = { id: user.id, emails: user.emails };
  done(null, newUser);
});

passport.deserializeUser((newUser: User, done) => {
  console.log(newUser);
  done(null, newUser);
});
