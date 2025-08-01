import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { UserModel } from "../models/User";
import * as dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth credentials not found in environment variables");
}

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;
          const firstName = profile.name?.givenName || "";
          const lastName = profile.name?.familyName || "";

          if (!email) {
            return done(
              new Error("No email found in Google profile"),
              undefined
            );
          }

          // Check if user already exists with this Google ID
          let user = await UserModel.findByGoogleId(googleId);

          if (user) {
            // User exists, update last login
            await UserModel.updateLastLogin(String(user.id));
            return done(null, user);
          }

          // Check if user exists with this email
          user = await UserModel.findByEmail(email);

          if (user) {
            // User exists with email, link Google account
            await UserModel.linkGoogleAccount(String(user.id), googleId);
            await UserModel.updateLastLogin(String(user.id));
            return done(null, user);
          }

          // Create new user
          const newUser = await UserModel.create({
            email,
            firstName,
            lastName,
            googleId,
            isEmailVerified: true, // Google emails are pre-verified
            emailVerifiedAt: new Date().toISOString(),
          });

          return done(null, newUser);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn(
    "Google OAuth credentials not configured, skipping Google authentication"
  );
}

export default passport;
