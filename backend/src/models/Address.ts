import { knex } from "../../db/knex";
import { Address as AddressType } from "../../../shared/types/address";

export class AddressModel {
  // Map DB (snake_case) to TS (camelCase)
  static fromDb(db: any): AddressType {
    return {
      id: db.id,
      userId: db.user_id,
      street: db.street,
      city: db.city,
      state: db.state,
      zip: db.zip,
      country: db.country,
      isDefault: db.is_default,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  static async getAll(): Promise<AddressType[]> {
    const addresses = await knex("address").select();
    return addresses.map(AddressModel.fromDb);
  }

  static async getById(id: string): Promise<AddressType | null> {
    const address = await knex("address").where({ id }).first();
    return address ? AddressModel.fromDb(address) : null;
  }

  static async findByUserId(userId: string): Promise<AddressType[]> {
    const addresses = await knex("address").where({ user_id: userId });
    return addresses.map(AddressModel.fromDb);
  }

  static async create(data: Partial<AddressType>): Promise<AddressType> {
    const dbData: any = {
      user_id: data.userId,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
    const [created] = await knex("address").insert(dbData).returning("*");
    return AddressModel.fromDb(created);
  }

  static async update(
    id: string,
    data: Partial<AddressType>
  ): Promise<AddressType | null> {
    const dbData: any = {};
    if (data.userId !== undefined) dbData.user_id = data.userId;
    if (data.street !== undefined) dbData.street = data.street;
    if (data.city !== undefined) dbData.city = data.city;
    if (data.state !== undefined) dbData.state = data.state;
    if (data.zip !== undefined) dbData.zip = data.zip;
    if (data.country !== undefined) dbData.country = data.country;
    if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt;
    const [updated] = await knex("address")
      .where({ id })
      .update(dbData)
      .returning("*");
    return updated ? AddressModel.fromDb(updated) : null;
  }

  static async delete(id: string): Promise<number> {
    return await knex("address").where({ id }).del();
  }
}
