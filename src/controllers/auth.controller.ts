import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import { User } from '~/models';
import userService from '~/services/user.service';
import { signToken } from '~/utils/signToken';

const saltRounds = 10;
class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password,phone } = req.body;

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
            return res.status(201).json({ message: 'User created' });
        }catch (error) {
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

        const validPassword = await bcrypt.compare(password, user.user_password, function(err: any, result: any) {
            if (err) {
                console.log(err);
                return res.status(401).json({ message: 'Invalid password' });
            }
            user.user_password = undefined;
            return res.status(200).json(user);
        });
    }
}   
export default new AuthController();