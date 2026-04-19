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
        useLocalStorageFallback: false,
        enableRealtime: false,
        enableEmailVerification: false
    },
    shouldUseBackend() {
        return this.features.useBackend && this.api.isConfigured();
    }
};

window.Config = Config;
