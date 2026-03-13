import { Router } from 'express';
import {
  login,
  registerCustomer,
  registerBusiness,
  me,
  updateMe,
  changePassword,
  adminCreateAdminUser,
  adminRequestPasswordReset,
  resetPasswordWithToken,
} from '../controllers/authController';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerCustomerSchema,
  registerBusinessSchema,
  updateProfileSchema,
  changePasswordSchema,
  adminCreateAdminUserSchema,
  adminRequestPasswordResetSchema,
  resetPasswordSchema,
} from '@bundle-up/validation';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register/customer', validate(registerCustomerSchema), registerCustomer);
router.post('/register/business', validate(registerBusinessSchema), registerBusiness);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateMe);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

// Admin tools
router.post(
  '/admin/users',
  ...requireAdmin,
  validate(adminCreateAdminUserSchema),
  adminCreateAdminUser,
);
router.post(
  '/admin/password-resets',
  ...requireAdmin,
  validate(adminRequestPasswordResetSchema),
  adminRequestPasswordReset,
);

// Public reset endpoint
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordWithToken);

export default router;
