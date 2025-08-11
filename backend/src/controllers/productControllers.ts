import { Request, Response } from "express";
import knex from "../../db/knex";
import {
  sendSuccess,
  sendInternalError,
  sendNotFoundError,
} from "../utils/responseHelpers";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  product_color?: string;
  product_count: number;
  image_url: string;
  b2c_price: number;
  b2b_price: number;
  inventory_by_carton: number;
  inventory_by_box: number;
  is_available: boolean;
  is_active: boolean;
  created_at: Date;
}

interface ProductFilters {
  category?: string;
  product_color?: string;
  product_count?: number;
  available?: boolean;
  search?: string;
}

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      console.log("before pulling query values");
      const {
        category,
        product_color,
        product_count,
        available,
        search,
        role,
        page = 1,
        limit = 10,
      } = req.query;
      console.log(2);

      // console.log(req);

      let query = knex("products").where("is_active", true);

      console.log(3);

      // Apply filters
      if (category) {
        query = query.where("category", category as string);
      }

      if (product_color) {
        query = query.where("product_color", product_color as string);
      }

      if (product_count) {
        query = query.where("product_count", Number(product_count));
      }

      if (available !== undefined) {
        query = query.where("is_available", available === "true");
      }

      console.log(4);

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

      console.log(5);

      // Get total count for pagination
      console.log("About to execute count query...");
      const countQuery = query.clone();
      console.log("Count query SQL:", countQuery.toSQL().sql);

      let total = 0;
      try {
        const totalCount = await countQuery.count("* as total").first();
        console.log("Count query result:", totalCount);
        total = Number(totalCount?.total || 0);
        console.log("Total count:", total);
      } catch (countError) {
        console.error("Count query failed:", countError);
        throw countError;
      }

      console.log(6);

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
          price: role === "b2c" ? product.b2c_price : product.b2b_price,
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
        ...(product_color && { product_color }),
        ...(product_count && { product_count }),
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
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [product] = await knex("products")
        .where("id", id)
        .where("is_active", true);

      if (!product) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        product,
      });
    } catch (error) {
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async getLowInventoryProducts(req: Request, res: Response) {
    try {
      const lowInventoryThreshold = 10; // Products with less than 10 cartons

      const products = await knex("products")
        .where("is_active", true)
        .andWhere(function () {
          this.where("inventory_by_carton", "<", lowInventoryThreshold).orWhere(
            "inventory_by_box",
            "<",
            lowInventoryThreshold
          );
        })
        .orderBy("inventory_by_carton", "asc");

      return sendSuccess(res, {
        products,
      });
    } catch (error) {
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
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
        "Product created successfully",
        201
      );
    } catch (error) {
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
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
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [deletedProduct] = await knex("products")
        .where("id", id)
        .update({ is_active: false })
        .returning("*");

      if (!deletedProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      return sendSuccess(res, {
        message: "Product deleted successfully",
      });
    } catch (error) {
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async updateInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { inventoryByCarton, inventoryByBox } = req.body;

      const updateData: any = {};
      if (inventoryByCarton !== undefined) {
        updateData.inventory_by_carton = inventoryByCarton;
      }
      if (inventoryByBox !== undefined) {
        updateData.inventory_by_box = inventoryByBox;
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
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async toggleAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get current product
      const [currentProduct] = await knex("products")
        .where("id", id)
        .select("is_available");

      if (!currentProduct) {
        return sendNotFoundError(res, "Product not found");
      }

      // Toggle availability
      const newAvailability = !currentProduct.is_available;

      const [updatedProduct] = await knex("products")
        .where("id", id)
        .update({ is_available: newAvailability })
        .returning("*");

      return sendSuccess(res, {
        product: updatedProduct,
      });
    } catch (error) {
      return sendInternalError(
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}
