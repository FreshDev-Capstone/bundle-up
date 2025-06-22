import knex from '../../db/knex';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'individual' | 'b2b';
  googleId?: string;
  passwordHash?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'individual' | 'b2b';
  googleId?: string;
  passwordHash?: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const [user] = await knex('users')
      .insert({
        ...userData,
        role: userData.role || 'individual',
        isEmailVerified: false,
      })
      .returning('*');
    
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await knex('users').where({ email }).first();
    return user || null;
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await knex('users').where({ googleId }).first();
    return user || null;
  }

  static async findById(id: string): Promise<User | null> {
    const user = await knex('users').where({ id }).first();
    return user || null;
  }

  static async updateLastLogin(id: string): Promise<void> {
    await knex('users')
      .where({ id })
      .update({ lastLoginAt: new Date() });
  }

  static async verifyEmail(id: string): Promise<void> {
    await knex('users')
      .where({ id })
      .update({ 
        isEmailVerified: true, 
        emailVerifiedAt: new Date() 
      });
  }

  static async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await knex('users')
      .where({ id })
      .update({
        ...data,
        updatedAt: new Date()
      })
      .returning('*');
    
    return user;
  }

  static async isAdminEmail(email: string): Promise<boolean> {
    return email.endsWith('@naturalfoodsinc.com');
  }

  static async getUsersByRole(role: 'admin' | 'individual' | 'b2b'): Promise<User[]> {
    return knex('users').where({ role });
  }
} 