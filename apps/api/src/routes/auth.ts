import { Router } from 'express';
import {
  login,
  registerCustomer,
  registerBusiness,
  me,
  updateMe,
  changePassword,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerCustomerSchema,
  registerBusinessSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@bundle-up/validation';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register/customer', validate(registerCustomerSchema), registerCustomer);
router.post('/register/business', validate(registerBusinessSchema), registerBusiness);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateMe);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
