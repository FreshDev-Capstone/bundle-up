import { Router } from 'express';
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  updateOrderAdmin,
} from '../controllers/orderController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '@bundle-up/validation';

const router = Router();

router.use(requireAuth);

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', validate(createOrderSchema), createOrder);

// Admin only
router.patch('/:id/status', ...requireAdmin, updateOrderStatus);
router.patch('/:id/admin', ...requireAdmin, updateOrderAdmin);

export default router;
