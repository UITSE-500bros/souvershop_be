import { Router } from 'express';
import { reportController } from '../controllers';
const router = Router();

router.get('/', reportController.getReport);

// có thể query để lọc theo khoảng ngày ví dụ ?begin=01/01/2024&end=31/01/2024
// cần truyền đúng format ngày dd/mm/yyyy
// hoặc không truyền gì để lấy toàn bộ

export default router;