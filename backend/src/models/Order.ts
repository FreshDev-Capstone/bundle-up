import knex from "../../db/knex";
import { Order as OrderType } from "../../../shared/types/order";
import { OrderItemModel } from "./OrderItem";

export class OrderModel {
  // Map DB (snake_case) to TS (camelCase)
  static fromDb(db: any): OrderType {
    return {
      id: db.id,
      userId: db.user_id,
      cartId: db.cart_id,
      addressId: db.address_id,
      orderNumber: db.order_number,
      status: db.status,
      items: [], // will be populated below
      subtotal: db.subtotal,
      tax: db.tax,
      shipping: db.shipping,
      total: db.total,
      paymentId: db.payment_id,
      notes: db.notes,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  static async getAll(): Promise<OrderType[]> {
    const orders = await knex("order").select();
    return Promise.all(
      orders.map(async (order: any) => {
        const o = OrderModel.fromDb(order);
        o.items = await OrderItemModel.findByOrderId(o.id);
        return o;
      })
    );
  }

  static async getById(id: string): Promise<OrderType | null> {
    const order = await knex("order").where({ id }).first();
    if (!order) return null;
    const o = OrderModel.fromDb(order);
    o.items = await OrderItemModel.findByOrderId(o.id);
    return o;
  }

  static async findByUserId(userId: string): Promise<OrderType[]> {
    const orders = await knex("order").where({ user_id: userId });
    return Promise.all(
      orders.map(async (order: any) => {
        const o = OrderModel.fromDb(order);
        o.items = await OrderItemModel.findByOrderId(o.id);
        return o;
      })
    );
  }

  static async create(data: Partial<OrderType>): Promise<OrderType> {
    const dbData: any = {
      user_id: data.userId,
      status: data.status,
      total: data.total,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
    const [created] = await knex("order").insert(dbData).returning("*");
    const o = OrderModel.fromDb(created);
    o.items = [];
    return o;
  }

  static async update(
    id: string,
    data: Partial<OrderType>
  ): Promise<OrderType | null> {
    const dbData: any = {};
    if (data.userId !== undefined) dbData.user_id = data.userId;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.total !== undefined) dbData.total = data.total;
    if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt;
    const [updated] = await knex("order")
      .where({ id })
      .update(dbData)
      .returning("*");
    if (!updated) return null;
    const o = OrderModel.fromDb(updated);
    o.items = await OrderItemModel.findByOrderId(o.id);
    return o;
  }

  static async delete(id: string): Promise<number> {
    return await knex("order").where({ id }).del();
  }
}
