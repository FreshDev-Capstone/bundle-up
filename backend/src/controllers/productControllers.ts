/**
 * @fileoverview Product controllers
 * @description Handles all product-related HTTP requests and responses
 */

import { Request, Response } from 'express';
import knex from '../db/knex';
import { sendSuccess, sendInternalError, sendNotFoundError } from '../utils/responseHelpers';

/**
 * Product interface representing a product in the system
 * @interface Product
 * @description Defines the structure of a product object with all properties
 */
interface Product {
  /** Unique identifier for the product (matching image file names) */
  id: number;
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product category */
  category: string;
  /** Egg color for egg products */
  eggColor?: string;
  /** Number of eggs in package */
  eggCount: number;
  /** Product image URL */
  imageUrl: string;
  /** B2C price for individual customers */
  b2cPrice: number;
  /** B2B price for wholesale customers */
  b2bPrice: number;
  /** Inventory count by carton (B2C tracking) */
  inventoryByCarton: number;
  /** Inventory count by box (B2B tracking) */
  inventoryByBox: number;
  /** Whether product is currently available */
  isAvailable: boolean;
  /** Whether product is active */
  isActive: boolean;
  /** Timestamp when product was created */
  createdAt: Date;
  /** Timestamp when product was last updated */
  updatedAt: Date;
}

/**
 * Product filter interface for query parameters
 * @interface ProductFilters
 * @description Defines the structure of product filtering options
 */
interface ProductFilters {
  /** Category to filter by */
  category?: string;
  /** Egg color to filter by */
  eggColor?: string;
  /** Egg count to filter by */
  eggCount?: number;
  /** Whether to show only available products */
  available?: boolean;
  /** Search term for product name/description */
  search?: string;
}

/**
 * Product controller class
 * @class ProductController
 * @description Static methods for handling all product-related operations
 */
export class ProductController {
  /**
   * Gets all products with optional filtering and search
   * @route GET /api/products
   * @description Retrieves all products with optional filtering by category, egg color, availability, search, and role-based pricing
   * 
   * @param {Request} req - Express request object with query parameters
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with products array or error message
   * 
   * @example
   * GET /api/products?category=organic&eggColor=brown&available=true&search=eggs&role=b2c&page=1&limit=10
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "products": [
   *       {
   *         "id": "prod_123",
   *         "name": "Organic Brown Eggs",
   *         "description": "Fresh organic brown eggs",
   *         "category": "organic",
   *         "eggColor": "brown",
   *         "eggCount": 12,
   *         "imageUrl": "/assets/eggs/organic-brown.png",
   *         "b2cPrice": 7.99,
   *         "b2bPrice": 6.29,
   *         "inventoryByCarton": 100,
   *         "inventoryByBox": 20,
   *         "isAvailable": true,
   *         "isActive": true
   *       }
   *     ],
   *     "pagination": {
   *       "page": 1,
   *       "limit": 10,
   *       "total": 25,
   *       "totalPages": 3,
   *       "hasNext": true,
   *       "hasPrev": false
   *     },
   *     "filters": {
   *       "category": "organic",
   *       "eggColor": "brown",
   *       "available": true,
   *       "search": "eggs",
   *       "role": "b2c"
   *     }
   *   }
   * }
   */
  static async getAllProducts(req: Request, res: Response) {
    try {
      const { 
        category, 
        eggColor, 
        eggCount,
        available, 
        search, 
        role,
        page = 1,
        limit = 10
      } = req.query;

      let query = knex('products').where('isActive', true);

      // Apply filters
      if (category) {
        query = query.where('category', category as string);
      }

      if (eggColor) {
        query = query.where('eggColor', eggColor as string);
      }

      if (eggCount) {
        query = query.where('eggCount', Number(eggCount));
      }

      if (available !== undefined) {
        query = query.where('isAvailable', available === 'true');
      }

      // Apply search
      if (search && typeof search === 'string') {
        const searchTerm = `%${search}%`;
        query = query.andWhere(function() {
          this.whereILike('name', searchTerm)
              .orWhereILike('description', searchTerm);
        });
      }

      // Get total count for pagination
      const countQuery = query.clone();
      const totalCount = await countQuery.count('* as total').first();
      const total = Number(totalCount?.total || 0);

      // Apply pagination
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;
      
      query = query.offset(offset).limit(limitNum);

      // Apply ordering
      query = query.orderBy('name');

      const products = await query;

      // Apply role-based pricing if specified
      let processedProducts = products;
      if (role && (role === 'b2c' || role === 'b2b')) {
        processedProducts = products.map(product => ({
          ...product,
          price: role === 'b2c' ? product.b2cPrice : product.b2bPrice
        }));
      }

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limitNum);
      const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      };

      // Prepare filters metadata
      const filters = {
        ...(category && { category }),
        ...(eggColor && { eggColor }),
        ...(eggCount && { eggCount }),
        ...(available !== undefined && { available }),
        ...(search && { search }),
        ...(role && { role })
      };

      return sendSuccess(res, {
        products: processedProducts,
        pagination,
        filters
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Gets a single product by ID
   * @route GET /api/products/:id
   * @description Retrieves a specific product by its ID
   * 
   * @param {Request} req - Express request object with product ID parameter
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with product data or error message
   * 
   * @example
   * GET /api/products/prod_123
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "product": {
   *       "id": "prod_123",
   *       "name": "Organic Brown Eggs",
   *       "description": "Fresh organic brown eggs",
   *       "category": "organic",
   *       "eggColor": "brown",
   *       "eggCount": 12,
   *       "imageUrl": "/assets/eggs/organic-brown.png",
   *       "b2cPrice": 7.99,
   *       "b2bPrice": 6.29,
   *       "inventoryByCarton": 100,
   *       "inventoryByBox": 20,
   *       "isAvailable": true,
   *       "isActive": true
   *     }
   *   }
   * }
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [product] = await knex('products')
        .where('id', id)
        .where('isActive', true);

      if (!product) {
        return sendNotFoundError(res, 'Product not found');
      }

      return sendSuccess(res, {
        product
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Gets products with low inventory (Admin only)
   * @route GET /api/products/low-inventory
   * @description Retrieves products with low inventory levels for admin monitoring
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with low inventory products or error message
   * 
   * @example
   * GET /api/products/low-inventory
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "products": [
   *       {
   *         "id": "prod_123",
   *         "name": "Organic Brown Eggs",
   *         "inventoryByCarton": 5,
   *         "inventoryByBox": 2,
   *         "isAvailable": true
   *       }
   *     ]
   *   }
   * }
   */
  static async getLowInventoryProducts(req: Request, res: Response) {
    try {
      const lowInventoryThreshold = 10; // Products with less than 10 cartons

      const products = await knex('products')
        .where('isActive', true)
        .andWhere(function() {
          this.where('inventoryByCarton', '<', lowInventoryThreshold)
              .orWhere('inventoryByBox', '<', lowInventoryThreshold);
        })
        .orderBy('inventoryByCarton', 'asc');

      return sendSuccess(res, {
        products
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Creates a new product (Admin only)
   * @route POST /api/products
   * @description Creates a new product with all required fields
   * 
   * @param {Request} req - Express request object with product data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with created product or error message
   * 
   * @example
   * POST /api/products
   * {
   *   "name": "New Organic Eggs",
   *   "description": "Fresh organic eggs",
   *   "category": "organic",
   *   "eggColor": "brown",
   *   "eggCount": 12,
   *   "imageUrl": "/assets/eggs/new-organic.png",
   *   "b2cPrice": 7.99,
   *   "b2bPrice": 6.29,
   *   "inventoryByCarton": 100,
   *   "inventoryByBox": 20,
   *   "isAvailable": true,
   *   "isActive": true
   * }
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;
      
      const [newProduct] = await knex('products')
        .insert(productData)
        .returning('*');

      return sendSuccess(res, {
        product: newProduct
      }, 201);
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Updates an existing product (Admin only)
   * @route PUT /api/products/:id
   * @description Updates an existing product with new data
   * 
   * @param {Request} req - Express request object with product ID and update data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with updated product or error message
   * 
   * @example
   * PUT /api/products/prod_123
   * {
   *   "name": "Updated Organic Eggs",
   *   "b2cPrice": 8.99,
   *   "inventoryByCarton": 150
   * }
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedProduct] = await knex('products')
        .where('id', id)
        .update(updateData)
        .returning('*');

      if (!updatedProduct) {
        return sendNotFoundError(res, 'Product not found');
      }

      return sendSuccess(res, {
        product: updatedProduct
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Deletes a product (Admin only)
   * @route DELETE /api/products/:id
   * @description Soft deletes a product by setting isActive to false
   * 
   * @param {Request} req - Express request object with product ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with success message or error message
   * 
   * @example
   * DELETE /api/products/prod_123
   * 
   * Response: {
   *   "success": true,
   *   "message": "Product deleted successfully"
   * }
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [deletedProduct] = await knex('products')
        .where('id', id)
        .update({ isActive: false })
        .returning('*');

      if (!deletedProduct) {
        return sendNotFoundError(res, 'Product not found');
      }

      return sendSuccess(res, {
        message: 'Product deleted successfully'
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Updates product inventory (Admin only)
   * @route PUT /api/products/:id/inventory
   * @description Updates the inventory levels for a specific product
   * 
   * @param {Request} req - Express request object with product ID and inventory data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with updated product or error message
   * 
   * @example
   * PUT /api/products/prod_123/inventory
   * {
   *   "inventoryByCarton": 200,
   *   "inventoryByBox": 50
   * }
   */
  static async updateInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { inventoryByCarton, inventoryByBox } = req.body;

      const updateData: any = {};
      if (inventoryByCarton !== undefined) {
        updateData.inventoryByCarton = inventoryByCarton;
      }
      if (inventoryByBox !== undefined) {
        updateData.inventoryByBox = inventoryByBox;
      }

      const [updatedProduct] = await knex('products')
        .where('id', id)
        .update(updateData)
        .returning('*');

      if (!updatedProduct) {
        return sendNotFoundError(res, 'Product not found');
      }

      return sendSuccess(res, {
        product: updatedProduct
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Toggles product availability (Admin only)
   * @route PUT /api/products/:id/toggle-availability
   * @description Toggles the availability status of a product
   * 
   * @param {Request} req - Express request object with product ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with updated product or error message
   * 
   * @example
   * PUT /api/products/prod_123/toggle-availability
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "product": {
   *       "id": "prod_123",
   *       "name": "Organic Brown Eggs",
   *       "isAvailable": false
   *     }
   *   }
   * }
   */
  static async toggleAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get current product
      const [currentProduct] = await knex('products')
        .where('id', id)
        .select('isAvailable');

      if (!currentProduct) {
        return sendNotFoundError(res, 'Product not found');
      }

      // Toggle availability
      const newAvailability = !currentProduct.isAvailable;

      const [updatedProduct] = await knex('products')
        .where('id', id)
        .update({ isAvailable: newAvailability })
        .returning('*');

      return sendSuccess(res, {
        product: updatedProduct
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }
} 