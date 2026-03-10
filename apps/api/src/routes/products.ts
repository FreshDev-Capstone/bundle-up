import { Router } from 'express';
import {
  listProducts,
  getProduct,
  listProductsAdmin,
  updateProductAvailability,
} from '../controllers/productController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Public product routes
router.get('/', listProducts);
router.get('/:idOrSlug', getProduct);

// Admin-only routes
router.get('/admin/all', ...requireAdmin, listProductsAdmin);
router.patch('/:id/availability', ...requireAdmin, updateProductAvailability);

export default router;
