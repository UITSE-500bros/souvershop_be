import {Router} from 'express';
import authRouter from './auth.route';
import categoryRouter from './category.route';
import grnRouter from './grn.route';
import productRouter from './product.route'
import reviewRouter from './review.route'
import receiptRouter from './receipt.route'
import adminRouter from './admin.route'

const router = Router();

router.use('/auth', authRouter);
router.use('/category',categoryRouter);
router.use('/grn',grnRouter);
router.use('/product',productRouter);
router.use('/review',reviewRouter);
router.use('/receipt',receiptRouter);
router.use('/admin',adminRouter);

export default router;