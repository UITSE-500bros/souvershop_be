var GoogleStrategy = require('passport-google-oidc')
var passport = require('passport')
import { config } from 'dotenv'
config()

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      prompt: 'select_account',
      scope: ["profile", "email"],
    },
    async (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
      console.log('profile', profile) 
      try {
        return done(null, profile)
      } catch (err) {
        done(err)
      }
    }
  )
)
passport.serializeUser((user: any, done) => {
  done(null, user)
})

passport.deserializeUser((user: any, done) => {
  done(null, user)
})

export default passport