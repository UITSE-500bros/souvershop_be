import {Router , Request , Response} from 'express';

const router = Router();
router.use('/product', require('./product'));
router.use('/user', require('./user'));
router.use('/employee', require('./employee'));
export default router;