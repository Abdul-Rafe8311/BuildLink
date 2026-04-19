/**
 * Application Configuration
 * Centralized configuration for backend services
 *
 * Live API URL (priority):
 * 1) <meta name="buildlink-api-base" content="https://your-api.com/api"> in index.html
 * 2) http://localhost:5001/api when opened from localhost / 127.0.0.1
 * 3) Same origin + /api when the site is served by the Node server (SERVE_FRONTEND=true)
 */

function readApiBaseFromMeta() {
    if (typeof document === 'undefined') return '';
    const el = document.querySelector('meta[name="buildlink-api-base"]');
    const v = el && el.getAttribute('content');
    return (v || '').trim();
}

function isLocalFrontend() {
    if (typeof location === 'undefined') return true;
    const h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

function resolveApiBaseURL() {
    const fromMeta = readApiBaseFromMeta().replace(/\/+$/, '');
    if (fromMeta) return fromMeta;

    if (isLocalFrontend()) {
        return 'http://localhost:5001/api';
    }

    if (
        typeof location !== 'undefined' &&
        location.origin &&
        !location.protocol.startsWith('file')
    ) {
        return `${location.origin}/api`.replace(/\/+$/, '');
    }

    return 'http://localhost:5001/api';
}

const Config = {
    // Backend API Configuration
    api: {
        baseURL: resolveApiBaseURL(),
        timeout: 10000, // Request timeout in milliseconds
        retryAttempts: 3, // Number of retry attempts for failed requests
        retryDelay: 1000, // Delay between retries in milliseconds

        // Check if backend is configured
        isConfigured() {
            return this.baseURL !== '';
        }
    },

    // Feature Flags
    features: {
        useBackend: true, // Set to true after backend is installed and running
        useLocalStorageFallback: false, // Keep localStorage as fallback
        enableRealtime: false, // Future: WebSocket support
        enableEmailVerification: false // Future: Email verification
    },

    // Helper to determine if backend should be used
    shouldUseBackend() {
        return this.features.useBackend && this.api.isConfigured();
    }
};

// Make config globally available
window.Config = Config;
