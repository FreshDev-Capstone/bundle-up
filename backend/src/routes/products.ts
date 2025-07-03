/**
 * @fileoverview Product routes configuration
 * @description Defines all product-related API endpoints following RESTful principles
 * 
 * @author Bundle Up Development Team
 * @version 1.0.0
 * @since 2025-06-22
 */

import express from 'express';
import { ProductController } from '../controllers/productControllers';
import { checkAuthentication } from '../middleware/auth';

/**
 * Product routes router instance
 * @type {Router}
 * @description Express router for all product-related endpoints
 */
const router = express.Router();

// Public routes (no authentication required)
/**
 * @route GET /api/products
 * @description Get all products with optional filtering and search
 * @access Public
 * 
 * @query {string} [category] - Filter by product category
 * @query {string} [eggColor] - Filter by egg color
 * @query {number} [eggCount] - Filter by egg count
 * @query {boolean} [available] - Filter by availability status
 * @query {string} [search] - Search in product name and description
 * @query {string} [role] - Get role-based pricing (b2c, b2b)
 * @query {number} [page] - Page number for pagination (default: 1)
 * @query {number} [limit] - Items per page (default: 10)
 * 
 * @example
 * GET /api/products
 * GET /api/products?category=organic&eggColor=brown&available=true
 * GET /api/products?search=organic&role=b2c
 * GET /api/products?page=2&limit=20
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @description Get a specific product by ID
 * @access Public
 * 
 * @param {string} id - Product ID
 * 
 * @example
 * GET /api/products/121
 * 
 * Response: {
 *   "success": true,
 *   "data": {
 *     "product": {
 *       "id": 121,
 *       "name": "Organic Brown Eggs - 12 Count",
 *       "description": "Certified organic brown eggs, 12 count carton",
 *       "category": "organic",
 *       "eggColor": "brown",
 *       "eggCount": 12,
 *       "b2cPrice": 6.99,
 *       "b2bPrice": 5.29,
 *       "inventoryByCarton": 80,
 *       "inventoryByBox": 15,
 *       "isAvailable": true
 *     }
 *   }
 * }
 */
router.get('/:id', ProductController.getProductById);

// Admin routes (authentication required)
/**
 * @route POST /api/products
 * @description Create a new product (Admin only)
 * @access Private (Admin)
 * 
 * @body {Object} productData - Product data
 * @body {string} productData.name - Product name
 * @body {string} productData.description - Product description
 * @body {string} productData.category - Product category
 * @body {string} [productData.eggColor] - Egg color
 * @body {number} [productData.eggCount] - Egg count
 * @body {string} productData.imageUrl - Product image URL
 * @body {number} productData.b2cPrice - B2C price
 * @body {number} productData.b2bPrice - B2B price
 * @body {number} [productData.inventoryByCarton] - Inventory count by carton (B2C)
 * @body {number} [productData.inventoryByBox] - Inventory count by box (B2B)
 * @body {boolean} [productData.isAvailable] - Availability status
 * @body {boolean} [productData.isActive] - Active status
 * 
 * @example
 * POST /api/products
 * {
 *   "name": "Organic Brown Eggs - 12 Count",
 *   "description": "Certified organic brown eggs, 12 count carton",
 *   "category": "organic",
 *   "eggColor": "brown",
 *   "eggCount": 12,
 *   "imageUrl": "/assets/eggs/Organic Brown Eggs/new-organic.png",
 *   "b2cPrice": 6.99,
 *   "b2bPrice": 5.29,
 *   "inventoryByCarton": 100,
 *   "inventoryByBox": 20,
 *   "isAvailable": true,
 *   "isActive": true
 * }
 */
router.post('/', checkAuthentication, ProductController.createProduct);

/**
 * @route PUT /api/products/:id
 * @description Update an existing product (Admin only)
 * @access Private (Admin)
 * 
 * @param {string} id - Product ID
 * @body {Object} updateData - Product update data
 * 
 * @example
 * PUT /api/products/121
 * {
 *   "name": "Updated Organic Brown Eggs",
 *   "b2cPrice": 7.99,
 *   "inventoryByCarton": 150
 * }
 */
router.put('/:id', checkAuthentication, ProductController.updateProduct);

/**
 * @route DELETE /api/products/:id
 * @description Delete a product (Admin only)
 * @access Private (Admin)
 * 
 * @param {string} id - Product ID
 * 
 * @example
 * DELETE /api/products/prod_123
 * 
 * Response: {
 *   "success": true,
 *   "message": "Product deleted successfully"
 * }
 */
router.delete('/:id', checkAuthentication, ProductController.deleteProduct);

export default router; 