"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// passport-setup.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    // Log the profile to see its structure
    console.log("Profile:", profile);
    done(null, profile); // Ensure profile is passed correctly
}));
passport_1.default.serializeUser((user, done) => {
    console.log("user", user);
    // Ensure user is defined and has an id
    if (user && user.id) {
        console.log("Serializing user:", user);
        done(null, user.id); // Store the user's Google ID in the session
    }
    else {
        done(new Error("User not found")); // Handle the case where user is undefined
    }
});
passport_1.default.deserializeUser((id, done) => {
    console.log("Deserializing user ID:", id);
    // Here you would typically fetch the user from your database
    done(null, { id }); // Replace with actual user fetching logic
});
