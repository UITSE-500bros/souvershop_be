import multer from 'multer';

// Cấu hình lưu trữ file tạm thời trong bộ nhớ
const storage = multer.memoryStorage();

// Tạo middleware upload
export const upload = multer({ storage: storage });