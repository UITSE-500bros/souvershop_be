import { config } from 'dotenv'
import { Request, Response } from 'express'
import { mailTemplate } from '../constants'
import { User } from '../models'
import { mailService, userService } from '../services'
import { signToken } from '../utils'
import passport from 'passport'
config()
const bcrypt = require('bcrypt')
const saltRounds = 10
// const SECRET_KEY = process.env.SECRET_KEY;

class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, phoneNumber } = req.body
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const userExist = await userService.getUserByEmail(email)
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const salt = await bcrypt.genSaltSync(saltRounds)
    const hashedPassword = await bcrypt.hashSync(password, salt)

    const customer = new User({
      user_name: name,
      user_email: email,
      user_password: hashedPassword,
      user_phoneNumber: phoneNumber,
      user_role: 14,
      created_at: new Date(),
      updated_at: new Date()
    })
    try {
      const response = await userService.createUser(customer)
      if (!response) {
        return res.status(400).json({ message: 'Error creating user' })
      }
      const verifiedEmailToken = await signToken({
        type: 'verifiedEmail',
        payload: { _id: response.user_id as string, user_role: 14 }
      })
      await mailService.sendVerifiedEmail(email, 'Verify your email', mailTemplate(verifiedEmailToken))
      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Error creating user' })
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await userService.getUserByEmail(email)
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(password, user.user_password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    if (user.account_status !== 'verify') {
      return res.status(400).json({ message: 'Please verify your email' })
    }
    const accessToken = await signToken({ type: 'accessToken', payload: { _id: user.user_id, user_role: user.user_role } });
    const refreshToken = await signToken({ type: 'refreshToken', payload: { _id: user.user_id, user_role: user.user_role } });
    
    // Now that accessToken and refreshToken are strings, pass them to the service
    await userService.updateUserTokens(user, { accessToken, refreshToken, });
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    return res.status(200).json({ accessToken, refreshToken }) 

  }

  // async requestRefreshToken(req: Request, res: Response) {
  //   const { user } = req.body
  //   // const accessToken = signToken({ type: 'accessToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
  //   // const newRefreshToken = signToken({ type: 'refreshToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
  //   //await userService.updateUser(user._id, { refreshToken: newRefreshToken })
  //   // res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true })
  //   // res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  // }

  // async sendVerifiedEmailAgain(req: Request, res: Response) {
  //   const { email } = req.body;
  //   const response = await userService.getUserByEmail(email);
  //   if (!response) {
  //     return res.status(400).json({ message: 'No user exists in database' });
  //   }
  //   const user_id = response.user_id;
  //   const verifiedEmailToken = await signToken({
  //     type: 'verifiedEmail',
  //     payload: { _id: user_id as string, user_role: 'customer' }
  //   });
  //   try {
  //     await Promise.all([
  //       userService.updateUserTokens(response, { verifyToken: verifiedEmailToken }),
  //       await mailService.sendVerifiedEmail(email, 'Verify your email', mailTemplate(verifiedEmailToken))
  //     ])
  //     res.status(201).json({ message: 'Please check your email to veriify' })
  //   } catch (err: any) {
  //     res.status(400).json({ message: `Please wait 10 minutes and try again` })
  //   }
  // }
  // async verifiedEmail(req: Request, res: Response) {
  //   const { token } = req.params; // Get the token from the request params
  //   try {
  //     // Verify and decode the token
  //     if (!SECRET_KEY) {
  //       return res.status(500).json({ message: 'Internal server error' });
  //     }

  //     const decoded: any = jwt.verify(token, SECRET_KEY);

  //     // Extract user ID or email from the token payload
  //     const user_id = decoded.userId;

  //     // Find the user in the database
  //     const user = await userService.getUserByID(user_id);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     // Check if the user is already verified
  //     if (user.account_status === AccountStatus.verify) {
  //       return res.status(200).json({ message: 'Email is already verified' });
  //     }

  //     // Update the user's verification status
  //     await userService.updateUser(user_id, {
  //       verify: AccountStatus.verify,
  //       verifiedEmailToken: '' // Optional: Clear the token field if stored
  //     });

  //     res.status(200).json({ message: 'Email has been successfully verified' });
  //   } catch (err: any) {
  //     // Handle errors, such as invalid or expired token
  //     res.status(400).json({ message: 'Invalid or expired token' });
  //   }
  // }

  // async createAccountForEmployees(req: Request, res: Response) {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).json({ message: 'No file uploaded' });
  //     }
  //     const upload = multer({ storage: multer.memoryStorage() });

  //     // Access the file buffer
  //     const fileBuffer = req.file.buffer;

  //     // Read the Excel file from buffer
  //     const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  //     // Get data from the first sheet
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const data = XLSX.utils.sheet_to_json(sheet);

  //     // Create an account for each employee
  //     data.forEach(async (employee: any) => {
  //       const { name, email, phone } = employee;

  //     });

  //   } catch (err: any) {
  //     return res.status(400).json({ message: err.message });
  //   }

  // }

  // async createAccountForEmployee(req: Request, res: Response) {
  //   const { name, email, phone, password } = req.body;
  //   if (!name || !email || !phone) {
  //     return res.status(400).json({ message: 'Please fill all fields' });
  //   }
  //   const userExist = await userService.getUserByEmail(email);
  //   if (userExist) {
  //     return res.status(400).json({ message: 'User already exists' });
  //   }
  //   const salt = await bcrypt.genSaltSync(saltRounds);
  //   const hashedPassword = await bcrypt.hashSync(password, salt);

  //   const employee = new User(
  //     {
  //       user_name: name,
  //       user_email: email,
  //       user_phoneNumber: phone,
  //       user_role: 14,
  //       user_password: hashedPassword,
  //       created_at: new Date(),
  //       updated_at: new Date()
  //     }
  //   );
  //   try {
  //     const response = await userService.createUser(employee);
  //     console.log('User created:', response);
  //     // const verifiedEmailToken = await signToken({
  //     //   type: 'verifiedEmail',
  //     //   payload: { _id: response.id, isAdmin: false }
  //     // });
  //     // await MailService.sendVerifiedEmail(user.email, 'Verify your email', mailTemplate(verifiedEmailToken));
  //     // return res.status(201).json({ message: 'User created' });
  //   } catch (error) {
  //     return res.status(400).json({ message: 'Error creating user' });
  //   }
  // }

  async googleLogin(req: Request, res: Response, next: Function) {
    passport.authenticate('google', { scope: ['openid', 'profile', 'email'] })(req, res, next)
  }
  async googleCallback(req: Request, res: Response, next: Function) {
    passport.authenticate('google', async (err, profile, info) => {
      if (err) {
        console.error('Authentication error:', err)
        return res.redirect('/login?error=authentication_failed')
      }

      if (!profile) {
        console.error('Profile not retrieved from Google.')
        return res.redirect('/login?error=profile_not_found')
      }
      try {
        const userData = {
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
              user_password: '',
              user_phoneNumber: '',
              user_role: 14,
              created_at: new Date(),
              updated_at: new Date(),
              googleId: userData.googleId
            })
          )
        }

        // Attach user to session
        req.logIn(user, (err) => {
          if (err) {
            console.error('Login error:', err)
            return res.redirect('/login?error=login_failed')
          }

          console.log('User authenticated and stored in session:', user)
          res.json({ success: true, user })
        })
      } catch (error) {
        console.error('Database error:', error)
        return res.redirect('/login?error=database_error')
      }
    })(req, res, next)
  }
}
export default new AuthController()
