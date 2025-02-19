import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.schema";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existUser = await User.findOne({ email: profile._json.email });
      if (existUser) {
        done(null, {
          userId: existUser._id,
          email: existUser.email,
          role: existUser.role,
        });
      } else {
        const newUser = new User({
          name: profile._json.name,
          email: profile._json.email,
          image: profile._json.picture,
          password: null,
          lastLoggedIn: new Date(),
        });
        await newUser.save();

        done(null, {
          userId: newUser._id,
          email: newUser.email,
          role: newUser.role,
        });
      }
    }
  )
);


