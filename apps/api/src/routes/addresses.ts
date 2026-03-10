import { Router } from 'express';
import db from '../config/db';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addressSchema } from '@bundle-up/validation';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response } from 'express';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await db('addresses').where({ user_id: req.user!.sub }).orderBy('is_default', 'desc');
  res.json({ success: true, data: addresses });
});

router.post('/', validate(addressSchema), async (req: AuthenticatedRequest, res: Response) => {
  const body = req.body as Record<string, unknown>;
  if (body['is_default']) {
    await db('addresses').where({ user_id: req.user!.sub }).update({ is_default: false });
  }
  const [address] = await db('addresses')
    .insert({ ...body, user_id: req.user!.sub })
    .returning('*');
  res.status(201).json({ success: true, data: address });
});

router.put('/:id', validate(addressSchema), async (req: AuthenticatedRequest, res: Response) => {
  const body = req.body as Record<string, unknown>;
  if (body['is_default']) {
    await db('addresses').where({ user_id: req.user!.sub }).update({ is_default: false });
  }
  const updated = await db('addresses')
    .where({ id: Number(req.params['id']), user_id: req.user!.sub })
    .update(body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Address not found' });
    return;
  }
  const address = await db('addresses').where({ id: Number(req.params['id']) }).first();
  res.json({ success: true, data: address });
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await db('addresses')
    .where({ id: Number(req.params['id']), user_id: req.user!.sub })
    .del();
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Address not found' });
    return;
  }
  res.json({ success: true, message: 'Address deleted' });
});

export default router;
