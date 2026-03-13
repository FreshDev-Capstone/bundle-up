import { Router } from 'express';
import {
  listProducts,
  getProduct,
  listProductsAdmin,
  updateProductAvailability,
  updateProductAdmin,
  updateProductInventoryAdmin,
} from '../controllers/productController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Public product routes
router.get('/', listProducts);

// Admin-only routes (must be defined before '/:idOrSlug')
router.get('/admin/all', ...requireAdmin, listProductsAdmin);
router.patch('/:id/availability', ...requireAdmin, updateProductAvailability);
router.patch('/:id/admin', ...requireAdmin, updateProductAdmin);
router.patch('/:id/inventory', ...requireAdmin, updateProductInventoryAdmin);

router.get('/:idOrSlug', getProduct);

export default router;
