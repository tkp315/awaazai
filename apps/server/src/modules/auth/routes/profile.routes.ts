import { Router } from 'express';
import multer from 'multer';
import { getMe, updateProfile, updateAvatar, getPreferences, upsertPreferences } from '../controllers/profile.controller.js';
import { authMiddleware } from '@middlewares/auth.middleware.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

// All profile routes are protected
router.use(authMiddleware);

router.get('/me', getMe);
router.patch('/', updateProfile);
router.patch('/avatar', upload.single('avatar'), updateAvatar);
router.get('/preferences', getPreferences);
router.patch('/preferences', upsertPreferences);

export default router;
