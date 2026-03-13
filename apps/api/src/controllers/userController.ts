import type { Response } from 'express';
import db from '../config/db';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function listUsersAdmin(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const users = await db('users')
    .leftJoin('user_profiles', 'users.id', 'user_profiles.user_id')
    .leftJoin('business_accounts', 'users.id', 'business_accounts.user_id')
    .select(
      'users.id',
      'users.email',
      'users.role',
      'users.is_active',
      'users.created_at',
      'users.updated_at',
      'user_profiles.first_name',
      'user_profiles.last_name',
      'user_profiles.phone',
      'business_accounts.company_name',
      'business_accounts.is_approved',
    )
    .orderBy('users.created_at', 'desc');

  res.json({ success: true, data: users });
}

export async function updateUserAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
    return;
  }

  const id = Number(req.params['id']);
  if (!Number.isInteger(id)) {
    res.status(400).json({ success: false, message: 'Invalid user id' });
    return;
  }

  const { email, role, is_active } = req.body as {
    email?: string;
    role?: 'customer' | 'business' | 'admin';
    is_active?: boolean;
  };

  if (id === req.user.sub && is_active === false) {
    res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    return;
  }

  const existing = await db('users').where({ id }).first();
  if (!existing) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const update: Record<string, unknown> = {};
  if (typeof email === 'string' && email.trim()) {
    const normalizedEmail = email.trim().toLowerCase();
    const dupe = await db('users').where({ email: normalizedEmail }).andWhereNot({ id }).first();
    if (dupe) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }
    update['email'] = normalizedEmail;
  }
  if (typeof role === 'string') update['role'] = role;
  if (typeof is_active === 'boolean') update['is_active'] = is_active;

  if (Object.keys(update).length === 0) {
    res.status(400).json({ success: false, message: 'No fields to update' });
    return;
  }

  await db('users').where({ id }).update(update);

  const row = await db('users')
    .leftJoin('user_profiles', 'users.id', 'user_profiles.user_id')
    .leftJoin('business_accounts', 'users.id', 'business_accounts.user_id')
    .select(
      'users.id',
      'users.email',
      'users.role',
      'users.is_active',
      'users.created_at',
      'users.updated_at',
      'user_profiles.first_name',
      'user_profiles.last_name',
      'user_profiles.phone',
      'business_accounts.company_name',
      'business_accounts.is_approved',
    )
    .where('users.id', id)
    .first();

  res.json({ success: true, data: row });
}
