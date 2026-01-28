import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { router as authRouter } from './routes/auth.route.js';
import { router as clientRouter } from './routes/client.route.js';
const app = express();
/* ---------- Configuración CORS ---------- */
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
    .split(',')
    .map(s => s.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
/* ---------- Middlewares base ---------- */
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
/* ---------- Healthcheck ---------- */
app.get('/api/health', (_req, res) => {
    const mongoState = mongoose.connection.readyState === 1 ? 'connected'
        : mongoose.connection.readyState === 2 ? 'connecting'
            : mongoose.connection.readyState === 3 ? 'disconnecting'
                : 'disconnected';
    res.json({ ok: true, mongo: mongoState });
});
/* ---------- Rutas ---------- */
app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
// (al final, después de montar las rutas)
app.use((err, _req, res, _next) => {
    console.error('🔥 ERROR:', err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error',
        // En desarrollo puedes exponer más info:
        // stack: err.stack,
    });
});
/* ---------- Server & DB ---------- */
const PORT = Number(process.env.PORT || 4000);
const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
    console.error('[ENV] MONGO_URI no está definida. Revisa tu .env');
    process.exit(1);
}
let server;
(async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // falla rápido si no conecta
            maxPoolSize: 10,
        });
        console.log('[DB] Conectado a MongoDB Atlas');
        server = app.listen(PORT, () => console.log(`[API] listening on :${PORT}`));
    }
    catch (err) {
        console.error('[DB] Error de conexión a MongoDB:', err.message);
        process.exit(1);
    }
})();
/* ---------- Cierre ordenado ---------- */
const shutdown = async (signal) => {
    console.log(`\n[SYS] Recibido ${signal}, apagando...`);
    try {
        await mongoose.connection.close();
        console.log('[DB] Conexión Mongo cerrada');
    }
    catch (e) {
        console.warn('[DB] No se pudo cerrar conexión Mongo limpiamente', e);
    }
    server?.close(() => {
        console.log('[API] Servidor cerrado');
        process.exit(0);
    });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
``;
