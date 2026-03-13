import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import addressRoutes from './routes/addresses';
import supportRoutes from './routes/support';
import userRoutes from './routes/users';
import uploadRoutes from './routes/uploads';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

dotenv.config();

// When run via npm workspaces, cwd is apps/api, so root .env is two levels up.
if (!process.env['JWT_SECRET']) {
  dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
}

const app = express();

// Serve local uploads (development-friendly)
app.use('/api/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? '*' }));
app.use(express.json());
app.use(apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
