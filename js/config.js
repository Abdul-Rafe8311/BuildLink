/**
 * Application Configuration
 * Centralized configuration for backend services
 */

const Config = {
    // Backend API Configuration
    api: {
        baseURL: 'http://localhost:5001/api', // Backend API base URL
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
