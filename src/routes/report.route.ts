import { Router } from 'express';
import { reportController } from '../controllers';
const router = Router();

router.get('/', reportController.getReport);

export default router;