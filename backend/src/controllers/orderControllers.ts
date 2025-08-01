import { Response } from "express";
import knex from "../../db/knex";
import { sendSuccess, sendError } from "../utils/responseHelpers";

export class OrderController {
  // Get all orders for a user
  static async getAllOrders(req: any, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "User not authenticated", 401);
      }

      // Get all orders for the user with order items
      const orders = await knex("orders")
        .select(
          "orders.id",
          "orders.order_number",
          "orders.status",
          "orders.total",
          "orders.created_at",
          "orders.updated_at"
        )
        .where("orders.user_id", userId)
        .orderBy("orders.created_at", "desc");

      // For each order, get the order items with product details
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const orderItems = await knex("order_items")
            .select(
              "order_items.id",
              "order_items.quantity",
              "order_items.price",
              "products.name",
              "products.description"
            )
            .join("products", "order_items.product_id", "products.id")
            .where("order_items.order_id", order.id);

          return {
            ...order,
            items: orderItems,
          };
        })
      );

      return sendSuccess(res, ordersWithItems, "Orders retrieved successfully");
    } catch (error) {
      console.error("Error fetching orders:", error);
      return sendError(res, "Failed to fetch orders", 500);
    }
  }

  // Get user's order history with product details
  static async getUserOrderHistory(req: any, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "User not authenticated", 401);
      }

      // Get orders with order items and product details
      const orders = await knex("orders")
        .select(
          "orders.id as order_id",
          "orders.status",
          "orders.created_at as order_date",
          "order_items.quantity",
          "order_items.product_id",
          "order_items.price as item_price",
          "products.*"
        )
        .join("order_items", "orders.id", "order_items.order_id")
        .join("products", "order_items.product_id", "products.id")
        .where("orders.user_id", userId)
        .orderBy("orders.created_at", "desc");

      // Group by product and aggregate order information
      const productOrderHistory = orders.reduce((acc: any, order: any) => {
        const productId = order.product_id;

        if (!acc[productId]) {
          acc[productId] = {
            id: order.id,
            name: order.name,
            description: order.description,
            category: order.category,
            product_color: order.product_color,
            product_count: order.product_count,
            image_url: order.image_url,
            b2c_price: order.b2c_price,
            b2b_price: order.b2b_price,
            inventory_by_carton: order.inventory_by_carton,
            inventory_by_box: order.inventory_by_box,
            is_available: order.is_available,
            is_active: order.is_active,
            created_at: order.created_at,
            lastOrdered: order.order_date,
            orderCount: 0,
            totalQuantity: 0,
            orderDates: [],
          };
        }

        acc[productId].orderCount += 1;
        acc[productId].totalQuantity += order.quantity;
        acc[productId].orderDates.push(order.order_date);

        // Update lastOrdered to the most recent order date
        if (new Date(order.order_date) > new Date(acc[productId].lastOrdered)) {
          acc[productId].lastOrdered = order.order_date;
        }

        return acc;
      }, {});

      // Convert to array and sort by most recent order
      const orderHistory = Object.values(productOrderHistory).sort(
        (a: any, b: any) =>
          new Date(b.lastOrdered).getTime() - new Date(a.lastOrdered).getTime()
      );

      return sendSuccess(
        res,
        {
          orderHistory,
          totalProducts: orderHistory.length,
        },
        "Order history retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching user order history:", error);
      return sendError(res, "Failed to fetch order history", 500);
    }
  }

  // Create a new order
  static async createOrder(req: any, res: Response) {
    try {
      const userId = req.user?.id;
      const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
      const { items, status } = req.body;
      const orderStatus = allowedStatuses.includes(status) ? status : "pending";

      if (!userId) {
        return sendError(res, "User not authenticated", 401);
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendError(res, "Order items are required", 400);
      }

      // Start a transaction
      const result = await knex.transaction(async (trx) => {
        // Create the order
        const [order] = await trx("orders")
          .insert({
            user_id: userId,
            status: orderStatus,
            order_number: `ORD-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            total: 0, // Will be calculated
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning("*");

        let totalAmount = 0;

        // Add order items
        for (const item of items) {
          const { productId, quantity, price } = item;

          // Get product details to calculate price
          const product = await trx("products").where("id", productId).first();

          if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
          }

          const itemPrice = price || product.b2c_price;
          const itemTotal = itemPrice * quantity;
          totalAmount += itemTotal;

          await trx("order_items").insert({
            order_id: order.id,
            product_id: productId,
            quantity: quantity,
            price: itemPrice,
          });
        }

        // Update order with total amount
        await trx("orders").where("id", order.id).update({
          total: totalAmount,
          updated_at: new Date(),
        });

        return { orderId: order.id, totalAmount };
      });

      return sendSuccess(res, result, "Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      return sendError(res, "Failed to create order", 500);
    }
  }

  // Get order details by ID
  static async getOrderById(req: any, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, "User not authenticated", 401);
      }

      const order = await knex("orders")
        .select(
          "orders.*",
          "order_items.quantity",
          "order_items.price as item_price",
          "products.*"
        )
        .join("order_items", "orders.id", "order_items.order_id")
        .join("products", "order_items.product_id", "products.id")
        .where("orders.id", id)
        .where("orders.user_id", userId)
        .first();

      if (!order) {
        return sendError(res, "Order not found", 404);
      }

      return sendSuccess(
        res,
        {
          order,
        },
        "Order details retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching order details:", error);
      return sendError(res, "Failed to fetch order details", 500);
    }
  }
}
