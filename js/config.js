/**
 * API base: same-origin /api (Render + Express serves UI + API).
 * Split hosting: <meta name="buildlink-api-base" content="https://api.example.com/api">
 */

function readApiBaseFromMeta() {
    if (typeof document === 'undefined') return '';
    const el = document.querySelector('meta[name="buildlink-api-base"]');
    const v = el && el.getAttribute('content');
    return (v || '').trim();
}

function resolveApiBaseURL() {
    const fromMeta = readApiBaseFromMeta().replace(/\/+$/, '');
    if (fromMeta) return fromMeta;

    // Local development: frontend and backend run on different ports
    if (typeof location !== 'undefined') {
        const h = location.hostname;
        const p = location.port;
        if (h === 'localhost' || h === '127.0.0.1') {
            // If already on port 5001 (served by Express directly) use same-origin /api
            if (p === '5001') return '/api';
            // Otherwise frontend dev server → point to backend port
            return 'http://localhost:5001/api';
        }
    }
    return '/api';
}

const Config = {
    api: {
        baseURL: resolveApiBaseURL(),
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000,
        isConfigured() {
            return this.baseURL !== '';
        }
    },
    features: {
        useBackend: true,
        useLocalStorageFallback: true,
        enableRealtime: false,
        enableEmailVerification: false
    },
    shouldUseBackend() {
        return this.features.useBackend && this.api.isConfigured();
    }
};

window.Config = Config;
