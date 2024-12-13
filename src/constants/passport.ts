import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_CALLBACK_URL
        : 'http://localhost:8000/api/auth/oauth2/redirect/google',
    },
    async (issuer, profile, done) => {
      try {
        console.log('Profile:', profile);
      } catch (error) {
        console.error('Google OAuth Error:', error);
      }
    }
  )
);
