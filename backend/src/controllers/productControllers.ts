import { Request, Response } from 'express';
import knex from '../../db/knex';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  eggColor: string;
  eggCount: number;
  price: number;
  wholesalePrice: number;
  inventoryByCarton: number;
  inventoryByBox: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductController {
  // Get all products with role-based pricing
  static async getAllProducts(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { category, eggColor, search } = req.query;

      let query = knex('products').where('isActive', true);

      // Apply filters
      if (category) {
        query = query.where('category', category as string);
      }

      if (eggColor) {
        query = query.where('eggColor', eggColor as string);
      }

      if (search) {
        query = query.whereILike('name', `%${search}%`);
      }

      const products = await query.orderBy('name');

      // Apply role-based pricing
      const productsWithPricing = products.map((product: Product) => {
        const baseProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          category: product.category,
          eggColor: product.eggColor,
          eggCount: product.eggCount,
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };

        if (user?.role === 'admin' || user?.role === 'b2b') {
          return {
            ...baseProduct,
            price: product.wholesalePrice,
            inventory: product.inventoryByBox,
            pricingType: 'wholesale'
          };
        } else {
          return {
            ...baseProduct,
            price: product.price,
            inventory: product.inventoryByCarton,
            pricingType: 'retail'
          };
        }
      });

      res.json({
        success: true,
        data: {
          products: productsWithPricing,
          total: productsWithPricing.length
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get single product with role-based pricing
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const product = await knex('products')
        .where({ id, isActive: true })
        .first();

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      const baseProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        eggColor: product.eggColor,
        eggCount: product.eggCount,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };

      let productWithPricing;
      if (user?.role === 'admin' || user?.role === 'b2b') {
        productWithPricing = {
          ...baseProduct,
          price: product.wholesalePrice,
          inventory: product.inventoryByBox,
          pricingType: 'wholesale',
          retailPrice: product.price, // Show retail price for reference
          wholesalePrice: product.wholesalePrice
        };
      } else {
        productWithPricing = {
          ...baseProduct,
          price: product.price,
          inventory: product.inventoryByCarton,
          pricingType: 'retail',
          retailPrice: product.price,
          wholesalePrice: product.wholesalePrice
        };
      }

      res.json({
        success: true,
        data: {
          product: productWithPricing
        }
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get product categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await knex('products')
        .where('isActive', true)
        .distinct('category')
        .pluck('category');

      res.json({
        success: true,
        data: {
          categories: categories.sort()
        }
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get egg colors
  static async getEggColors(req: Request, res: Response) {
    try {
      const colors = await knex('products')
        .where('isActive', true)
        .distinct('eggColor')
        .pluck('eggColor');

      res.json({
        success: true,
        data: {
          colors: colors.sort()
        }
      });
    } catch (error) {
      console.error('Get colors error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Admin: Create new product
  static async createProduct(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        imageUrl,
        category,
        eggColor,
        eggCount,
        price,
        wholesalePrice,
        inventoryByCarton,
        inventoryByBox
      } = req.body;

      // Validate required fields
      if (!name || !description || !imageUrl || !category || !eggColor || !eggCount || !price || !wholesalePrice) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      const [product] = await knex('products')
        .insert({
          name,
          description,
          imageUrl,
          category,
          eggColor,
          eggCount,
          price,
          wholesalePrice,
          inventoryByCarton: inventoryByCarton || 0,
          inventoryByBox: inventoryByBox || 0,
          isActive: true
        })
        .returning('*');

      res.status(201).json({
        success: true,
        data: {
          product
        }
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Admin: Update product
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [product] = await knex('products')
        .where({ id })
        .update({
          ...updateData,
          updatedAt: new Date()
        })
        .returning('*');

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: {
          product
        }
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Admin: Delete product (soft delete)
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [product] = await knex('products')
        .where({ id })
        .update({
          isActive: false,
          updatedAt: new Date()
        })
        .returning('*');

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: {
          message: 'Product deleted successfully'
        }
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 