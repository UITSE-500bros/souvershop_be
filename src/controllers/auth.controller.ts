import { config } from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from "multer";
import XLSX from "xlsx";
import { mailTemplate } from '~/constants';
import { User } from '~/models';
import { mailService, userService } from '~/services';
import { AccountStatus, signToken } from '~/utils';
config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY;

class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const userExist = await userService.getUserByEmail(email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const customer = new User(
      {
        user_name: name,
        user_email: email,
        user_password: hashedPassword,
        user_phoneNumber: phoneNumber,
        user_role: 14,
        created_at: new Date(),
        updated_at: new Date()
      }
    );
    try {
      const response = await userService.createUser(customer);
      if (!response) {
        return res.status(400).json({ message: 'Error creating user' });
      }
      const verifiedEmailToken = await signToken({
        type: 'verifiedEmail',
        payload: { _id: response.user_id as string, user_role: 'customer' }
      });
      await mailService.sendVerifiedEmail(email, 'Verify your email', mailTemplate(verifiedEmailToken));
      return res.status(201).json({ message: 'User created' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Error creating user' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user === undefined) {
      return res.status(400).json({ message: 'No user exists in database' });
    }

    // const _id = user._id;
    // const isAdmin = user.role === 'admin';
    // const accessToken = signToken({ type: 'accessToken', payload: { _id, isAdmin } })
    // const refreshToken = signToken({ type: 'refreshToken', payload: { _id, isAdmin } })
    // const token = await Promise.all([accessToken, refreshToken])

    // const validPassword = await bcrypt.compare(password, user.user_password, function (err: any, result: any) {
    //   if (err) {
    //     console.log(err);
    //     return res.status(401).json({ message: 'Invalid password' });
    //   }
    //   user.user_password = undefined;
    //   res.cookie('refreshToken', token[1], { httpOnly: true, sameSite: 'strict', secure: true });
    //   return res.status(200).json(user);
    // });
  }

  async requestRefreshToken(req: Request, res: Response) {
    const { user } = req.body
    // const accessToken = signToken({ type: 'accessToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    // const newRefreshToken = signToken({ type: 'refreshToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    //await userService.updateUser(user._id, { refreshToken: newRefreshToken })
    // res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    // res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  }

  async sendVerifiedEmailAgain(req: Request, res: Response) {
    const { email } = req.body;
    const response = await userService.getUserByEmail(email);
    if (!response) {
      return res.status(400).json({ message: 'No user exists in database' });
    }
    const user_id = response.user_id;
    const verifiedEmailToken = await signToken({
      type: 'verifiedEmail',
      payload: { _id: user_id as string, user_role: 'customer' }
    });
    try {
      await Promise.all([
        userService.updateUserTokens(response, { verifyToken: verifiedEmailToken }),
        await mailService.sendVerifiedEmail(email, 'Verify your email', mailTemplate(verifiedEmailToken))
      ])
      res.status(201).json({ message: 'Please check your email to veriify' })
    } catch (err: any) {
      res.status(400).json({ message: `Please wait 10 minutes and try again` })
    }
  }
  async verifiedEmail(req: Request, res: Response) {
    const { token } = req.params; // Get the token from the request params
    try {
      // Verify and decode the token
      if (!SECRET_KEY) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      const decoded: any = jwt.verify(token, SECRET_KEY);

      // Extract user ID or email from the token payload
      const user_id = decoded.userId;

      // Find the user in the database
      const user = await userService.getUserByID(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user is already verified
      if (user.account_status === AccountStatus.verify) {
        return res.status(200).json({ message: 'Email is already verified' });
      }

      // Update the user's verification status
      await userService.updateUser(user_id, {
        verify: AccountStatus.verify,
        verifiedEmailToken: '' // Optional: Clear the token field if stored
      });

      res.status(200).json({ message: 'Email has been successfully verified' });
    } catch (err: any) {
      // Handle errors, such as invalid or expired token
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  }

  async createAccountForEmployees(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const upload = multer({ storage: multer.memoryStorage() });


      // Access the file buffer
      const fileBuffer = req.file.buffer;

      // Read the Excel file from buffer
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      // Get data from the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Create an account for each employee
      data.forEach(async (employee: any) => {
        const { name, email, phone } = employee;
        



      });

    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }

  }

  async createAccountForEmployee(req: Request, res: Response) {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const userExist = await userService.getUserByEmail(email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const employee = new User(
      {
        user_name: name,
        user_email: email,
        user_phoneNumber: phone,
        user_role: 14,
        user_password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }
    );
    try {
      const response = await userService.createUser(employee);
      console.log('User created:', response);
      // const verifiedEmailToken = await signToken({
      //   type: 'verifiedEmail',
      //   payload: { _id: response.id, isAdmin: false }
      // });
      // await MailService.sendVerifiedEmail(user.email, 'Verify your email', mailTemplate(verifiedEmailToken));
      // return res.status(201).json({ message: 'User created' });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating user' });
    }
  }
}
export default new AuthController();