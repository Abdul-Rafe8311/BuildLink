require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
if (!process.env.JWT_SECRET) {
    if (isProduction) {
        console.error('FATAL: JWT_SECRET must be set in production');
        process.exit(1);
    }
    console.warn('⚠️  JWT_SECRET missing — using a development-only default. Set JWT_SECRET in backend/.env.');
    process.env.JWT_SECRET = 'buildquote-dev-access-secret-not-for-production';
}
if (!process.env.JWT_REFRESH_SECRET) {
    if (isProduction) {
        console.error('FATAL: JWT_REFRESH_SECRET must be set in production');
        process.exit(1);
    }
    console.warn('⚠️  JWT_REFRESH_SECRET missing — using a development-only default. Set JWT_REFRESH_SECRET in backend/.env.');
    process.env.JWT_REFRESH_SECRET = 'buildquote-dev-refresh-secret-not-for-production';
}

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const plotRoutes = require('./routes/plots');
const quoteRoutes = require('./routes/quotes');
const contactRoutes = require('./routes/contact');

const app = express();

const frontendRoot = path.resolve(__dirname, '..');

const allowedOrigins = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
].filter(Boolean);

if (process.env.RENDER_EXTERNAL_URL) {
    allowedOrigins.push(process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, ''));
}
if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    const d = process.env.RAILWAY_PUBLIC_DOMAIN.replace(/\/+$/, '');
    allowedOrigins.push(d.startsWith('http') ? d : `https://${d}`);
}
if (process.env.FLY_APP_NAME) {
    allowedOrigins.push(`https://${process.env.FLY_APP_NAME}.fly.dev`);
}
if (process.env.VERCEL_URL) {
    const v = process.env.VERCEL_URL.replace(/\/+$/, '');
    allowedOrigins.push(v.startsWith('http') ? v : `https://${v}`);
}

const allowedOriginSet = new Set(allowedOrigins.filter(Boolean));
const isDev = process.env.NODE_ENV !== 'production';

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOriginSet.has(origin)) return callback(null, true);
        if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// 1) /health
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'BuildQuote Pro API is running',
        timestamp: new Date().toISOString()
    });
});

// 2) /api/* — do not remove
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contact', contactRoutes);

// 3) Static frontend (repo root: index.html, js/, css/)
app.use(express.static(frontendRoot));

// 4) SPA fallback
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendRoot, 'index.html'));
});

// 5) 404 JSON (unknown /api/*, etc.)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// 6) Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on http://0.0.0.0:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
