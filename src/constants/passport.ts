var GoogleStrategy = require('passport-google-oidc')
var passport = require('passport')
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/oauth2/redirect/google',
      prompt: 'select_account',
    },
    async (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
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
