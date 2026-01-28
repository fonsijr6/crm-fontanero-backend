
import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth.mw.js';
import { Client } from '../models/Client.js';

export const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const ownerId = (req as any).user.sub;
  const clients = await Client.find({ ownerId }).sort({ createdAt: -1 }).limit(50);
  res.json(clients);
});

router.post('/', async (req, res) => {
  const schema = z.object({ name: z.string().min(2), phone: z.string().optional(), address: z.string().optional(), notes: z.string().optional() });
  const data = schema.parse(req.body);
  const ownerId = (req as any).user.sub;
  const created = await Client.create({ ownerId, ...data });
  res.status(201).json(created);
});
