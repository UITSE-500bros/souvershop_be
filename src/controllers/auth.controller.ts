import { config } from 'dotenv'
import { Request, Response } from 'express'
import { mailTemplate } from '../constants'
import { User } from '../models'
import { mailService, userService } from '../services'
import { signToken } from '../utils'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { RefreshtokenRequest } from '../type'
config()
import bcrypt from 'bcrypt'
const saltRounds = 10
class AuthController {
  // For normal registration at Customer side 
  async register(req: Request, res: Response) {
    const { user_email, user_password } = req.body
    if (!user_email || !user_password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const userExist = await userService.getUserByEmail(user_email)
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const salt = await bcrypt.genSaltSync(saltRounds)
    const hashedPassword = await bcrypt.hashSync(user_password, salt)
    const customer = new User({
      user_email: user_email,
      user_password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    })
    try {
      const response = await userService.createUser(customer, 'customer')
      if (!response) {
        return res.status(400).json({ message: 'Error creating user' })
      }
      const verifiedEmailToken = await signToken({
        type: 'verifiedEmail',
        payload: { _id: response.user_id as string, user_role: 'khách hàng' }
      })
      await mailService.sendVerifiedEmail(user_email, 'Verify your email', mailTemplate(verifiedEmailToken))
      await userService.updateUserTokens(response, { verifyToken: verifiedEmailToken });
      return res.status(201).json({ message: 'Your account created sucessfully. Please check email to confirm registration' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Error creating user' })
    }
  }

  async login(req: Request, res: Response) {
    const { user_email, user_password } = req.body
    if (!user_email || !user_password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await userService.getUserByEmail(user_email)
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(user_password, user.user_password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    if (user.user_account_status !== 'active') {
      if (user.user_account_status === 'verified') {
        await userService.updateStatus(user, 'active');

      } else {
        return res.status(400).json({ message: 'Please verify your email' })
      }
    }
    let role = await userService.getUserRole(user)
    if (!role) {
      return res.status(400).json({ message: 'Error getting user role' })
    }

    let roleName: string;
    switch (role.role_id) {
      case 1:
        roleName = 'nhân viên'
        break;
      case 2:
        roleName = 'khách hàng'
        break;
      default:
        roleName = 'chủ cửa hàng'
        break;
    }

    const accessToken = await signToken({
      type: 'accessToken',
      payload: { _id: user.user_id, user_role: roleName }
    });
    const refreshToken = await signToken({
      type: 'refreshToken',
      payload: { _id: user.user_id, user_role: roleName }
    });

    // Save tokens in the service (optional, if needed for token tracking/revocation)
    await userService.updateUserTokens(user, { accessToken, refreshToken });

    // Only send the access token in the JSON response
    return res.status(200).json({ accessToken, refreshToken });

  }

  async verifyEmail(req: Request, res: Response) {
    const { verifytoken } = req.body
    if (!verifytoken) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    const payload = jwt.verify(verifytoken, process.env.EMAIL_SECRET_HASH);
    if (typeof payload !== 'string' && payload && 'user_role' in payload && '_id' in payload) {
      const userId = payload._id;
      const user = await userService.getUserByID(userId)
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' })
      }
      if (user.account_status === 'active') {
        return res.status(400).json({ message: 'Email already verified' })
      }
      await userService.updateStatus(user, 'verified');

      await mailService.sendDiscount(user.user_email, 'CUSDISCOUNT')
      return res.status(200).json({ message: 'Email verified successfully' })
    }
    return res.status(400).json({ message: 'Invalid token' })
  }

  async forgotPassword(req: Request, res: Response) {
    const { user_email } = req.body
    if (!user_email) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await userService.getUserByEmail(user_email)
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }
    let role = await userService.getUserRole(user)
    if (!role) {
      return res.status(400).json({ message: 'Error getting user role' })
    }

    let roleName: string;
    switch (role.role_id) {
      case 1:
        roleName = 'nhân viên'
        break;
      case 2:
        roleName = 'khách hàng'
        break;
      default:
        roleName = 'chủ cửa hàng'
        break;
    }
    const resetPasToken = await signToken({
      type: 'resetPassword',
      payload: { _id: user.user_id, user_role: roleName }
    });

    await userService.updateUserTokens(user, { resetPasToken });
    await mailService.sendResetPasswordEmail(user_email, 'Reset your password', mailTemplate(resetPasToken))
    return res.status(200).json({ message: 'Please check your email to reset password' })
  }
  async refreshToken(req: RefreshtokenRequest, res: Response) {
    try {
      const user_id_token = req.userId;
      const user = await userService.getUserByID(user_id_token)
      let role = await userService.getUserRole(user)
      if (!role) {
        return res.status(400).json({ message: 'Error getting user role' })
      }

      let roleName: string;
      switch (role.role_id) {
        case 1:
          roleName = 'nhân viên'
          break;
        case 2:
          roleName = 'khách hàng'
          break;
        default:
          roleName = 'chủ cửa hàng'
          break;
      }


      // Issue new accessToken (and optionally a new refreshToken if you rotate them)
      const newAccessToken = await signToken({
        type: 'accessToken',
        payload: { _id: user_id_token, user_role: roleName },
      });
      // Return the new accessToken to the client
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(500).json({ message: 'Could not refresh token' });
    }
  }
  // For Googole registration
  async googleLogin(req: Request, res: Response, next: Function) {
    passport.authenticate('google', { scope: ["profile", "email"] })(req, res, next)
  }

  async googleCallback(req: Request, res: Response, next: Function) {
    interface GoogleProfile {
      id: string;
      displayName: string;
      emails?: { value: string }[];
      photos?: { value: string }[];
    }

    interface UserData {
      googleId: string;
      displayName: string;
      email: string | null;
      avatar: string | null;
    }

    passport.authenticate('google', async (err: Error, profile: GoogleProfile, info: any) => {
      if (err) {
        console.error('Authentication error:', err)
        return res.redirect('/login?error=authentication_failed')
      }

      if (!profile) {
        console.error('Profile not retrieved from Google.')
        return res.redirect('/login?error=profile_not_found')
      }
      try {
        const userData: UserData = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          avatar: profile.photos?.[0]?.value || null
        }

        // Check or create the user in the database
        let user = await userService.getUserByEmail(userData.email)

        if (!user) {
          user = await userService.createUser(
            new User({
              user_avatar: userData.avatar,
              user_name: userData.displayName,
              user_email: userData.email,
              created_at: new Date(),
              updated_at: new Date(),
              googleId: userData.googleId
            }),
            'customer'
          )
          // Attach user to session
          req.logIn(user, async (err: Error) => {
            if (err) {
              console.error('Login error:', err)
              return res.redirect('/login?error=login_failed')
            }

            const verifiedEmailToken = await signToken({
              type: 'verifiedEmail',
              payload: { _id: user.user_id as string, user_role: 'khách hàng' }
            })
            await mailService.sendVerifiedEmail(user.user_email, 'Verify your email', mailTemplate(verifiedEmailToken))
            await userService.updateUserTokens(user, { verifyToken: verifiedEmailToken });
            return res.status(201).json({ message: 'Your account created sucessfully. Please check email to confirm registration' })
          })
        } else {

          let role = await userService.getUserRole(user)
          if (!role) {
            return res.status(400).json({ message: 'Error getting user role' })
          }

          let roleName: string;
          switch (role.role_id) {
            case 1:
              roleName = 'nhân viên'
              break;
            case 2:
              roleName = 'khách hàng'
              break;
            default:
              roleName = 'chủ cửa hàng'
              break;
          }

          const accessToken = await signToken({
            type: 'accessToken',
            payload: { _id: user.user_id, user_role: roleName }
          });
          const refreshToken = await signToken({
            type: 'refreshToken',
            payload: { _id: user.user_id, user_role: roleName }
          });

          // Save tokens in the service (optional, if needed for token tracking/revocation)
          await userService.updateUserTokens(user, { accessToken, refreshToken });
          // return res.status(200).json({ accessToken, refreshToken });
          res.redirect(`http://localhost:5173/verify-email?accessToken=${accessToken}&refreshToken=${refreshToken}`)
        }
      } catch (error) {
        console.error('Database error:', error)
        return res.redirect('/login?error=database_error')
      }
    })(req, res, next)
  }
}
export default new AuthController()