import { knex } from "../../db/knex";
import { OrderItem as OrderItemType } from "../../../shared/types/order";

export class OrderItemModel {
  // Map DB (snake_case) to TS (camelCase)
  static fromDb(db: any): OrderItemType {
    return {
      id: db.id,
      orderId: db.order_id,
      productId: db.product_id,
      quantity: db.quantity,
      price: db.price,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  static async getAll(): Promise<OrderItemType[]> {
    const items = await knex("order_item").select();
    return items.map(OrderItemModel.fromDb);
  }

  static async getById(id: string): Promise<OrderItemType | null> {
    const item = await knex("order_item").where({ id }).first();
    return item ? OrderItemModel.fromDb(item) : null;
  }

  static async findByOrderId(orderId: string): Promise<OrderItemType[]> {
    const items = await knex("order_item").where({ order_id: orderId });
    return items.map(OrderItemModel.fromDb);
  }

  static async create(data: Partial<OrderItemType>): Promise<OrderItemType> {
    const dbData: any = {
      order_id: data.orderId,
      product_id: data.productId,
      quantity: data.quantity,
      price: data.price,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
    const [created] = await knex("order_item").insert(dbData).returning("*");
    return OrderItemModel.fromDb(created);
  }

  static async update(
    id: string,
    data: Partial<OrderItemType>
  ): Promise<OrderItemType | null> {
    const dbData: any = {};
    if (data.orderId !== undefined) dbData.order_id = data.orderId;
    if (data.productId !== undefined) dbData.product_id = data.productId;
    if (data.quantity !== undefined) dbData.quantity = data.quantity;
    if (data.price !== undefined) dbData.price = data.price;
    if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt;
    const [updated] = await knex("order_item")
      .where({ id })
      .update(dbData)
      .returning("*");
    return updated ? OrderItemModel.fromDb(updated) : null;
  }

  static async delete(id: string): Promise<number> {
    return await knex("order_item").where({ id }).del();
  }
}
