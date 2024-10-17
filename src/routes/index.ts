import {Router , Request , Response} from 'express';

const router = Router();
router.use('/product', );
router.use('/user', require('./user'));
router.use('/employee', require('./employee'));
router.use('/category', require('./category'));

export default router;