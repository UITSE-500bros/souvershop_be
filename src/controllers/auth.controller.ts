import { Request, Response } from 'express';
import { mailTemplate } from '~/constants/verifiyEmailTemplate';
const bcrypt = require('bcrypt');
import { User } from '~/models';
import userService from '~/services/user.service';
import { signToken } from '~/utils/signToken';
import MailService from '~/services/mail.service';

const saltRounds = 10;
class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;

    const userExist = await userService.getUserByEmail(email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const role = 14;
    const user = new User(
      {
        name,
        email,
        password: hashedPassword,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone
      }
    );
    try {
      const response = await userService.createUser(user);
      console.log('User created:', response);

      const verifiedEmailToken = await signToken({
        type: 'verifiedEmail',
        payload: { _id: response.id, isAdmin: false }
      });
      await MailService.sendVerifiedEmail(user.email, 'Verify your email', mailTemplate(verifiedEmailToken));
      return res.status(201).json({ message: 'User created' });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating user' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const _id = user._id;
    const isAdmin = user.role === 'admin';
    const accessToken = signToken({ type: 'accessToken', payload: { _id, isAdmin } })
    const refreshToken = signToken({ type: 'refreshToken', payload: { _id, isAdmin } })
    const token = await Promise.all([accessToken, refreshToken])

    const validPassword = await bcrypt.compare(password, user.user_password, function (err: any, result: any) {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid password' });
      }
      user.user_password = undefined;
      res.cookie('refreshToken', token[1], { httpOnly: true, sameSite: 'strict', secure: true });
      return res.status(200).json(user);
    });
  }

  async requestRefreshToken(req: Request, res: Response) {
    const { user } = req.body
    const accessToken = signToken({ type: 'accessToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    const newRefreshToken = signToken({ type: 'refreshToken', payload: { _id: user._id, isAdmin: user.isAdmin } })
    //await userService.updateUser(user._id, { refreshToken: newRefreshToken })
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  }

  async sendVerifiedEmail(req: Request, res: Response) {
    const verifiedEmailToken = await signToken({
      type: 'verifiedEmail',
      payload: { _id: req.body._id, isAdmin: req.body.isAdmin }
    })
    try {
      await Promise.all([
        //userService.updateUser(req.body._id, { verifiedEmailToken: verifiedEmailToken }),
        //sendEmail(req.body.email, 'Verify your email', mailTemplate(verifiedEmailToken))
      ])
      res.status(201).json({ message: 'Please check your email to veriify' })
    } catch (err: any) {
      res.status(400).json({ message: `Please wait 10 minutes and try again` })
    }
  }
  async verifiedEmail(req: Request, res: Response) {
    const { _id } = req.body
    try {
      //await userService.updateUser(_id, { verify: userVerifyStatus.Verified, verifiedEmailToken: '' })
      res.status(201).json({ message: 'Email is verified' })
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }

  async createAccountForEmployees(req: Request, res: Response) {
    

  }

  async createAccountForEmployee(req: Request, res: Response) {

  }
}
export default new AuthController();