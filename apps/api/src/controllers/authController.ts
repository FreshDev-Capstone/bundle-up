import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { AuthTokenPayload } from '@bundle-up/shared-types';
import { sendPasswordResetEmail } from '../lib/mailer';

const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '7d';

function signToken(payload: AuthTokenPayload): string {
  const jwtSecret = process.env['JWT_SECRET'];
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getWebBaseUrl(): string {
  return process.env['WEB_BASE_URL'] ?? 'http://localhost:3000';
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user = await db('users').where({ email }).first();
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  if (!user.is_active) {
    res.status(403).json({ success: false, message: 'Account is disabled' });
    return;
  }

  const profile = await db('user_profiles').where({ user_id: user.id }).first();
  const business_account =
    user.role === 'business'
      ? await db('business_accounts').where({ user_id: user.id }).first()
      : undefined;

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, role: user.role, is_active: user.is_active },
      profile,
      business_account,
    },
  });
}

export async function registerCustomer(req: Request, res: Response): Promise<void> {
  const { email, password, first_name, last_name, phone } = req.body as {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };

  const existing = await db('users').where({ email }).first();
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const [user] = await db('users')
    .insert({ email, password_hash, role: 'customer' })
    .returning(['id', 'email', 'role', 'is_active']);

  const [profile] = await db('user_profiles')
    .insert({ user_id: user.id, first_name, last_name, phone: phone ?? null })
    .returning('*');

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  res.status(201).json({ success: true, data: { token, user, profile } });
}

export async function registerBusiness(req: Request, res: Response): Promise<void> {
  const { email, password, first_name, last_name, phone, company_name, tax_id, billing_email } =
    req.body as {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
      company_name: string;
      tax_id?: string;
      billing_email?: string;
    };

  const existing = await db('users').where({ email }).first();
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const [user] = await db('users')
    .insert({ email, password_hash, role: 'business' })
    .returning(['id', 'email', 'role', 'is_active']);

  const [profile] = await db('user_profiles')
    .insert({ user_id: user.id, first_name, last_name, phone: phone ?? null })
    .returning('*');

  const [business_account] = await db('business_accounts')
    .insert({
      user_id: user.id,
      company_name,
      tax_id: tax_id ?? null,
      billing_email: billing_email ?? null,
      is_approved: false,
    })
    .returning('*');

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  res.status(201).json({ success: true, data: { token, user, profile, business_account } });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const user = await db('users').where({ id: req.user.sub }).first();
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const profile = await db('user_profiles').where({ user_id: user.id }).first();
  const business_account =
    user.role === 'business'
      ? await db('business_accounts').where({ user_id: user.id }).first()
      : undefined;

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, role: user.role, is_active: user.is_active },
      profile,
      business_account,
    },
  });
}

export async function updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { email, first_name, last_name, phone, company_name, tax_id, billing_email } = req.body as {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    company_name?: string;
    tax_id?: string;
    billing_email?: string;
  };

  const user = await db('users').where({ id: req.user.sub }).first();
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (email && email !== user.email) {
    const existing = await db('users').where({ email }).andWhereNot({ id: user.id }).first();
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }
    await db('users').where({ id: user.id }).update({ email });
  }

  const profileUpdate: Record<string, unknown> = {};
  if (first_name !== undefined) profileUpdate['first_name'] = first_name;
  if (last_name !== undefined) profileUpdate['last_name'] = last_name;
  if (phone !== undefined) profileUpdate['phone'] = phone || null;

  if (Object.keys(profileUpdate).length > 0) {
    await db('user_profiles').where({ user_id: user.id }).update(profileUpdate);
  }

  if (user.role === 'business') {
    const businessUpdate: Record<string, unknown> = {};
    if (company_name !== undefined) businessUpdate['company_name'] = company_name;
    if (tax_id !== undefined) businessUpdate['tax_id'] = tax_id || null;
    if (billing_email !== undefined) businessUpdate['billing_email'] = billing_email || null;

    if (Object.keys(businessUpdate).length > 0) {
      await db('business_accounts').where({ user_id: user.id }).update(businessUpdate);
    }
  }

  const refreshedUser = await db('users').where({ id: user.id }).first();
  const profile = await db('user_profiles').where({ user_id: user.id }).first();
  const business_account =
    refreshedUser.role === 'business'
      ? await db('business_accounts').where({ user_id: user.id }).first()
      : undefined;

  res.json({
    success: true,
    data: {
      user: {
        id: refreshedUser.id,
        email: refreshedUser.email,
        role: refreshedUser.role,
        is_active: refreshedUser.is_active,
      },
      profile,
      business_account,
    },
  });
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { current_password, new_password } = req.body as {
    current_password: string;
    new_password: string;
  };

  if (current_password === new_password) {
    res.status(400).json({ success: false, message: 'New password must be different' });
    return;
  }

  const user = await db('users').where({ id: req.user.sub }).first();
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const valid = await bcrypt.compare(current_password, user.password_hash);
  if (!valid) {
    res.status(401).json({ success: false, message: 'Current password is incorrect' });
    return;
  }

  const password_hash = await bcrypt.hash(new_password, 10);
  await db('users').where({ id: user.id }).update({ password_hash });

  res.json({ success: true, message: 'Password updated successfully' });
}

export async function adminCreateAdminUser(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
    return;
  }

  const { email, password } = req.body as { email: string; password: string };

  const existing = await db('users').where({ email }).first();
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [user] = await db('users')
    .insert({ email, password_hash, role: 'admin', is_active: true })
    .returning(['id', 'email', 'role', 'is_active']);

  await db('user_profiles').insert({
    user_id: user.id,
    first_name: 'Admin',
    last_name: 'User',
    phone: null,
  });

  res.status(201).json({ success: true, data: { user } });
}

export async function adminRequestPasswordReset(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
    return;
  }

  const { email } = req.body as { email: string };
  const user = await db('users').where({ email }).first();
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db('password_resets').insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    used_at: null,
  });

  const reset_url = `${getWebBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;

  let email_sent = false;
  try {
    email_sent = await sendPasswordResetEmail(email, reset_url);
  } catch {
    email_sent = false;
  }

  // Always include the link in the response so admins can copy it
  // even if SMTP is not configured.
  res.status(201).json({
    success: true,
    data: { reset_url, expires_at: expiresAt.toISOString(), email_sent },
  });
}

export async function resetPasswordWithToken(req: Request, res: Response): Promise<void> {
  const { token, new_password } = req.body as { token: string; new_password: string };

  const tokenHash = sha256(token);
  const reset = await db('password_resets')
    .where({ token_hash: tokenHash })
    .andWhere('expires_at', '>', db.fn.now())
    .whereNull('used_at')
    .first();

  if (!reset) {
    res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
    return;
  }

  const password_hash = await bcrypt.hash(new_password, 10);

  await db.transaction(async (trx) => {
    await trx('users')
      .where({ id: reset.user_id })
      .update({ password_hash, updated_at: trx.fn.now() });
    await trx('password_resets')
      .where({ id: reset.id })
      .update({ used_at: trx.fn.now(), updated_at: trx.fn.now() });
  });

  res.json({ success: true, message: 'Password reset successfully' });
}
