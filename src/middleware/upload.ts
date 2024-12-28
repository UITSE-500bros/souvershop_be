import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only jpg or png files can be uploaded.'));
    }
  },
});