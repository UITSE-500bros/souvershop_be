import { Router } from 'express'
import { AuthController } from '../controllers'
import { Request, Response } from 'express'
import authMiddleware, { AuthenticatedRequest } from '../middleware/authorizeRole';
import { refreshTokenMiddleware } from '../middleware';

const authRouter = Router()

authRouter.post('/register', AuthController.register);
authRouter.post('/signin', AuthController.login);
authRouter.get('/login/federated/google', AuthController.googleLogin)
authRouter.get('/oauth2/redirect/google', AuthController.googleCallback)
authRouter.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    req.session?.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err)
        return res.status(500).json({ message: 'Session destroy failed' })
      }
      res.clearCookie('connect.sid');  
      // All operations succeeded
      return res.status(200).json({ message: 'Logout successful' })
    })
  })
})
authRouter.post('/forgot-password', AuthController.forgotPassword)
authRouter.post('/verify-email', AuthController.verifyEmail)
authRouter.post('/refresh-token', refreshTokenMiddleware, AuthController.refreshToken)
authRouter.post('/test',authMiddleware, function(req: AuthenticatedRequest, res) {
  console.log(req.customerId);
})
export default authRouter