import { Router } from 'express';
import { profileController } from '../controllers';
import { upload } from '../middleware/upload';
import { authMiddleware } from '../middleware';

const router = Router();

router.patch('/',authMiddleware, upload.single('avatar'), profileController.updateProfile);
router.get('/',authMiddleware, profileController.getProfile);
// cập nhật avatar sẽ lưu file vào bucket avatars với tên là <user_id>.jpg(png)
export default router;