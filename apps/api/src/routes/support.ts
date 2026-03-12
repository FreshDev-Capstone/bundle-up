import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { supportChat } from '../controllers/supportController';

const router = Router();

const supportChatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  context: z
    .object({
      variant: z.enum(['sfi', 'nfi']),
    })
    .optional(),
});

router.post('/chat', validate(supportChatSchema), supportChat);

export default router;
