import { Router } from 'express';
import { profileController } from '../controllers';
import { upload } from '../middleware/upload';

const router = Router();

router.put('/:user_id', upload.single('avatar'), profileController.updateProfile);

// cập nhật avatar sẽ lưu file vào bucket avatars với tên là <user_id>.jpg(png)
export default router;