import { Request, Response } from "express";
import knex from "../../db/knex";
import {
  sendSuccess,
  sendInternalError,
  sendNotFoundError,
} from "../utils/responseHelpers";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  eggColor?: string;
  eggCount: number;
  imageUrl: string;
  b2cPrice: number;
  b2bPrice: number;
  inventoryByCarton: number;
  inventoryByBox: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductFilters {
  category?: string;
  eggColor?: string;
  eggCount?: number;
  available?: boolean;
  search?: string;
}

export class ProductController {
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
        limit = 10,
      } = req.query;

      let query = knex("products").where("isActive", true);

      // Apply filters
      if (category) {
        query = query.where("category", category as string);
      }

      if (eggColor) {
        query = query.where("eggColor", eggColor as string);
      }

      if (eggCount) {
        query = query.where("eggCount", Number(eggCount));
      }

      if (available !== undefined) {
        query = query.where("isAvailable", available === "true");
      }

      // Apply search
      if (search && typeof search === "string") {
        const searchTerm = `%${search}%`;
        query = query.andWhere(function () {
          this.whereILike("name", searchTerm).orWhereILike(
            "description",
            searchTerm
          );
        });
      }

      // Get total count for pagination
      const countQuery = query.clone();
      const totalCount = await countQuery.count("* as total").first();
      const total = Number(totalCount?.total || 0);

      // Apply pagination
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      query = query.offset(offset).limit(limitNum);

      // Apply ordering
      query = query.orderBy("name");

      const products = await query;

      // Apply role-based pricing if specified
      let processedProducts = products;
      if (role && (role === "b2c" || role === "b2b")) {
        processedProducts = products.map((product) => ({
          ...product,
          price: role === "b2c" ? product.b2cPrice : product.b2bPrice,
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
        hasPrev: pageNum > 1,
      };

      // Prepare filters metadata
      const filters = {
        ...(category && { category }),
        ...(eggColor && { eggColor }),
        ...(eggCount && { eggCount }),
        ...(available !== undefined && { available }),
        ...(search && { search }),
        ...(role && { role }),
      };

      return sendSuccess(res, {
        products: processedProducts,
        pagination,
        filters,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [product] = await knex("products")
        .where("id", id)
        .where("isActive", true);

      if (!product) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        product,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async getLowInventoryProducts(req: Request, res: Response) {
    try {
      const lowInventoryThreshold = 10; // Products with less than 10 cartons

      const products = await knex("products")
        .where("isActive", true)
        .andWhere(function () {
          this.where("inventoryByCarton", "<", lowInventoryThreshold).orWhere(
            "inventoryByBox",
            "<",
            lowInventoryThreshold
          );
        })
        .orderBy("inventoryByCarton", "asc");

      return sendSuccess(res, {
        products,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;

      const [newProduct] = await knex("products")
        .insert(productData)
        .returning("*");

      return sendSuccess(
        res,
        {
          product: newProduct,
        },
        201
      );
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const [updatedProduct] = await knex("products")
        .where("id", id)
        .update(updateData)
        .returning("*");

      if (!updatedProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        product: updatedProduct,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [deletedProduct] = await knex("products")
        .where("id", id)
        .update({ isActive: false })
        .returning("*");

      if (!deletedProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        message: "Product deleted successfully",
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

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

      const [updatedProduct] = await knex("products")
        .where("id", id)
        .update(updateData)
        .returning("*");

      if (!updatedProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        product: updatedProduct,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async toggleAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get current product
      const [currentProduct] = await knex("products")
        .where("id", id)
        .select("isAvailable");

      if (!currentProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      // Toggle availability
      const newAvailability = !currentProduct.isAvailable;

      const [updatedProduct] = await knex("products")
        .where("id", id)
        .update({ isAvailable: newAvailability })
        .returning("*");

      return sendSuccess(res, {
        product: updatedProduct,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }
}
