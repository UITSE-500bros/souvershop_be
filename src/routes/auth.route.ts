import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '~/controllers';

const authRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/verifyEmail', AuthController.verifiedEmail);

authRouter.post('/registerEmployees',upload.single("file"), AuthController.createAccountForEmployees);
export default authRouter;