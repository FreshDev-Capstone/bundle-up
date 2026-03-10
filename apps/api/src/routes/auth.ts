import { Router } from 'express';
import { login, registerCustomer, registerBusiness, me } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerCustomerSchema,
  registerBusinessSchema,
} from '@bundle-up/validation';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register/customer', validate(registerCustomerSchema), registerCustomer);
router.post('/register/business', validate(registerBusinessSchema), registerBusiness);
router.get('/me', requireAuth, me);

export default router;
