import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { register, login } from '../services/auth.service.js';
export const router = Router();
/* ----- Tipos y opciones para JWT ----- */
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL ?? '15m');
const REFRESH_TTL = (process.env.JWT_REFRESH_TTL ?? '7d');
/* ----- /register ----- */
router.post('/register', async (req, res) => {
    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
    });
    const data = schema.parse(req.body);
    const out = await register(data.name, data.email, data.password);
    res.status(201).json(out);
});
/* ----- /login ----- */
router.post('/login', async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });
    const data = schema.parse(req.body);
    const out = await login(data.email, data.password); // { access, refresh, user }
    // Refresh como cookie httpOnly
    res.cookie('refresh', out.refresh, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 3600 * 1000,
    });
    res.json({ access: out.access, user: out.user });
});
/* ----- /refresh ----- */
router.post('/refresh', async (req, res) => {
    try {
        const token = req.cookies?.refresh;
        if (!token)
            return res.status(401).json({ error: 'NO_REFRESH' });
        // verify: devuelve string | JwtPayload -> normalizamos
        const verified = jwt.verify(token, REFRESH_SECRET);
        const payload = typeof verified === 'string' ? { sub: verified } : verified;
        const sub = String(payload.sub ?? '');
        if (!sub)
            return res.status(401).json({ error: 'INVALID_REFRESH' });
        const accessOptions = { expiresIn: ACCESS_TTL };
        const access = jwt.sign({ sub }, ACCESS_SECRET, accessOptions);
        res.json({ access });
    }
    catch {
        res.status(401).json({ error: 'INVALID_REFRESH' });
    }
});
