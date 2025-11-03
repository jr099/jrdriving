import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import driverRoutes from './routes/drivers';
import missionRoutes from './routes/missions';
import quoteRoutes from './routes/quotes';
import { env } from './env';

export const app = express();

// Nécessaire derrière un proxy (Coolify/Traefik/Nginx) pour les cookies `secure`
app.set('trust proxy', 1);

app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/quotes', quoteRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[api] Unhandled error:', error);
  res.status(500).json({ message: "Une erreur inattendue s'est produite." });
});
