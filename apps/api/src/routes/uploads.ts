import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { requireAdmin, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const uploadsDir = path.resolve(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      ensureUploadsDir();
      cb(null, uploadsDir);
    } catch (err) {
      cb(err as Error, uploadsDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
    const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext) ? ext : '.png';
    const name = `product-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post(
  '/product-image',
  ...requireAdmin,
  upload.single('file'),
  (req: AuthenticatedRequest, res) => {
    const file = (req as unknown as { file?: Express.Multer.File }).file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const url = `/api/uploads/${encodeURIComponent(file.filename)}`;
    res.status(201).json({ success: true, data: { url } });
  },
);

export default router;
