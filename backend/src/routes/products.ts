import { Router } from 'express';
import { ProductController } from '../controllers/productControllers';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/', ProductController.getAllProducts);
router.get('/categories', ProductController.getCategories);
router.get('/colors', ProductController.getEggColors);

// Authenticated routes
router.get('/:id', authenticateJWT, ProductController.getProductById);

// Admin-only routes
router.post('/', authenticateJWT, requireAdmin, ProductController.createProduct);
router.put('/:id', authenticateJWT, requireAdmin, ProductController.updateProduct);
router.delete('/:id', authenticateJWT, requireAdmin, ProductController.deleteProduct);

export default router; 