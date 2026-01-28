import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
// Forzamos tipos correctos de secrets y TTL
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL ?? '15m');
const REFRESH_TTL = (process.env.JWT_REFRESH_TTL ?? '7d');
// Helpers para firmar tokens con tipos seguros
function signAccessToken(sub, role) {
    const options = { expiresIn: ACCESS_TTL };
    return jwt.sign({ sub, role }, ACCESS_SECRET, options);
}
function signRefreshToken(sub) {
    const options = { expiresIn: REFRESH_TTL };
    return jwt.sign({ sub, type: 'refresh' }, REFRESH_SECRET, options);
}
export async function register(name, email, password) {
    const exists = await User.findOne({ email });
    if (exists)
        throw new Error('EMAIL_IN_USE');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'owner' });
    return { id: user.id, name: user.name, email: user.email };
}
export async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user)
        throw new Error('INVALID_CREDENTIALS');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        throw new Error('INVALID_CREDENTIALS');
    const access = signAccessToken(user.id, user.role);
    const refresh = signRefreshToken(user.id);
    return {
        access,
        refresh,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
}
