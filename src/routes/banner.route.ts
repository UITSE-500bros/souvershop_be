import { Router } from 'express';
import { bannerController } from '../controllers';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', bannerController.getBanners);
router.post('/:bannerName', upload.single('file'), bannerController.updateBanner);

export default router;