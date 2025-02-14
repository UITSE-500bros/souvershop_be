import {Router} from 'express';
import authRouter from './auth.route';
import categoryRouter from './category.route'
import grnRouter from './grn.route';
import productRouter from './product.route'
import reviewRouter from './review.route'
import receiptRouter from './receipt.route'
import adminRouter from './admin.route'
import bannerRouter from './banner.route'
import profileRouter from './profile.route'
import reportRouter from './report.route'
import customerRouter from './customer.route'
import employeeRouter from './employee.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/category',categoryRouter);
router.use('/grn',grnRouter);
router.use('/product',productRouter);
router.use('/review',reviewRouter);
router.use('/receipt',receiptRouter);
router.use('/admin',adminRouter);
router.use('/banner', bannerRouter);
router.use('/profile', profileRouter);
router.use('/report', reportRouter);
router.use('/customer', customerRouter);
router.use('/employee', employeeRouter);

export default router;