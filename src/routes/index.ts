import {Router , Request , Response} from 'express';
import authRouter from './auth.route';
import categoryRouter from './category.route';
import grnRouter from './grn.route';
const router = Router();

router.use('/auth', authRouter);
router.use('/category',categoryRouter);
router.use('/grn',grnRouter);


export default router;