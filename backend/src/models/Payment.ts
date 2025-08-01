import { knex } from "../../db/knex";
import { Payment as PaymentType } from "../../../shared/types/payment";

export class PaymentModel {
  // Map DB (snake_case) to TS (camelCase)
  static fromDb(db: any): PaymentType {
    return {
      id: db.id,
      orderId: db.order_id,
      amount: db.amount,
      method: db.method,
      status: db.status,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  static async getAll(): Promise<PaymentType[]> {
    const payments = await knex("payment").select();
    return payments.map(PaymentModel.fromDb);
  }

  static async getById(id: string): Promise<PaymentType | null> {
    const payment = await knex("payment").where({ id }).first();
    return payment ? PaymentModel.fromDb(payment) : null;
  }

  static async findByOrderId(orderId: string): Promise<PaymentType[]> {
    const payments = await knex("payment").where({ order_id: orderId });
    return payments.map(PaymentModel.fromDb);
  }

  static async create(data: Partial<PaymentType>): Promise<PaymentType> {
    const dbData: any = {
      order_id: data.orderId,
      amount: data.amount,
      method: data.method,
      status: data.status,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
    const [created] = await knex("payment").insert(dbData).returning("*");
    return PaymentModel.fromDb(created);
  }

  static async update(
    id: string,
    data: Partial<PaymentType>
  ): Promise<PaymentType | null> {
    const dbData: any = {};
    if (data.orderId !== undefined) dbData.order_id = data.orderId;
    if (data.amount !== undefined) dbData.amount = data.amount;
    if (data.method !== undefined) dbData.method = data.method;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt;
    const [updated] = await knex("payment")
      .where({ id })
      .update(dbData)
      .returning("*");
    return updated ? PaymentModel.fromDb(updated) : null;
  }

  static async delete(id: string): Promise<number> {
    return await knex("payment").where({ id }).del();
  }
}
