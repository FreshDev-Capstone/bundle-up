import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { AuthTokenPayload } from '@bundle-up/shared-types';

const JWT_SECRET = process.env['JWT_SECRET'] as string;
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '7d';

function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
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
