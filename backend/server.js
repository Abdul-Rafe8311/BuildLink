require('dotenv').config();

// JWT is required for login/register. In development, use safe defaults if unset
// so the app works after `git clone` before editing `.env`.
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

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const plotRoutes = require('./routes/plots');
const quoteRoutes = require('./routes/quotes');
const contactRoutes = require('./routes/contact');

// Initialize app
const app = express();

// Middleware — CORS (comma-separated FRONTEND_URL / FRONTEND_URLS; common PaaS URLs auto-detected)
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
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOriginSet.has(origin)) {
            return callback(null, true);
        }

        // Local dev: same machine often uses 127.0.0.1 vs localhost or different ports
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

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'BuildQuote Pro API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contact', contactRoutes);

// Production: serve static frontend from repo root (parent of /backend) so one URL hosts UI + /api
const serveFrontend = process.env.SERVE_FRONTEND === 'true' || process.env.SERVE_FRONTEND === '1';
if (serveFrontend) {
    const frontendRoot = path.join(__dirname, '..');
    app.use((req, res, next) => {
        if (req.path.includes('.git')) {
            return res.status(404).end();
        }
        next();
    });
    app.use(
        express.static(frontendRoot, {
            index: ['index.html'],
            dotfiles: 'ignore'
        })
    );
    app.get(/^\/(?!api\/).*/, (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        res.sendFile(path.join(frontendRoot, 'index.html'), (err) => {
            if (err) next(err);
        });
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server (single DB connection — connectDB already handles mongoose.connect)
const PORT = Number.parseInt(process.env.PORT, 10) || 5001;
const HOST = process.env.HOST || '0.0.0.0';

connectDB()
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8000'}`);
            if (serveFrontend) {
                console.log('📁 Serving static frontend from parent directory (SERVE_FRONTEND=true)');
            }
        });
    })
    .catch((err) => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});
