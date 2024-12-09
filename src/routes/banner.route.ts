import { Router } from 'express';
import { bannerController } from '../controllers';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', bannerController.getBanners);
router.put('/:bannerName', upload.single('file'), bannerController.updateBanner);

export default router;