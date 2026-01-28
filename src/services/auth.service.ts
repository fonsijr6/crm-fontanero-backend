
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function register(name: string, email: string, password: string) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('EMAIL_IN_USE');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return { id: user.id, name: user.name, email: user.email };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('INVALID_CREDENTIALS');
  const ok = await bcrypt.compare(password, (user as any).passwordHash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_TTL || '15m' });
  const refresh = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_TTL || '7d' });
  return { access, refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
