import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import appConfig from "../config/app.js";
dotenv.config();
// Konfigurasi Passport
passport.use(new GoogleStrategy({
    clientID: "160801539479-147jshv55s8esq0ps42mnpu3l61trmk1.apps.googleusercontent.com",
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
