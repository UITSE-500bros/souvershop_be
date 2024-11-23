import { Router } from 'express';
var GoogleStrategy = require('passport-google-oidc');
import { AuthController } from '../controllers';
var passport = require('passport');

const authRouter = Router();
passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/oauth2/redirect/google',
      },
      async (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
        try {
          console.log('profile', profile);
        } catch (err) {
          done(err);
        }
      }
    )
  );

authRouter.post('/register', AuthController.register);
authRouter.get('/login/federated/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

authRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: 'http://localhost:3000/',
  failureRedirect: ''
}));

export default authRouter;