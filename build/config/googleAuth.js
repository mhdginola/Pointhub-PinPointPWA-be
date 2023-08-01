import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import appConfig from "../config/app.js";
// eslint-disable-next-line import/no-named-as-default-member
dotenv.config();
// Konfigurasi Passport
passport.use(new GoogleStrategy({
    clientID: "424415121221-tsa40hs66v4t99qhpuhaq5v9t7quofbp.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: `${appConfig.url}/v1/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
    // Callback setelah login berhasil
    // Lakukan operasi autentikasi atau registrasi pengguna di sini
    // Objek profile akan berisi informasi pengguna dari Google
    done(null, profile);
}));
// Konfigurasi serialisasi dan deserialisasi pengguna
passport.serializeUser((user, done) => {
    const newUser = { id: user.id, emails: user.emails };
    done(null, newUser);
});
passport.deserializeUser((newUser, done) => {
    console.log(newUser);
    done(null, newUser);
});
