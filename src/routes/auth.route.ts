
import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { register, login } from '../services/auth.service.js';

export const router = Router();

router.post('/register', async (req, res) => {
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
  const data = schema.parse(req.body);
  const out = await register(data.name, data.email, data.password);
  res.status(201).json(out);
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const data = schema.parse(req.body);
  const out = await login(data.email, data.password);
  // set refresh as httpOnly cookie
  res.cookie('refresh', out.refresh, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*3600*1000 });
  res.json({ access: out.access, user: out.user });
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refresh;
    if (!token) return res.status(401).json({ error: 'NO_REFRESH' });
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    const access = jwt.sign({ sub: (payload as any).sub }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_TTL || '15m' });
    res.json({ access });
  } catch (e) {
    res.status(401).json({ error: 'INVALID_REFRESH' });
  }
});
