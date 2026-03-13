import { Router } from 'express';
import { listUsersAdmin, updateUserAdmin } from '../controllers/userController';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { adminUpdateUserSchema } from '@bundle-up/validation';

const router = Router();

// Admin-only
router.get('/admin/all', ...requireAdmin, listUsersAdmin);
router.patch('/admin/:id', ...requireAdmin, validate(adminUpdateUserSchema), updateUserAdmin);

export default router;
