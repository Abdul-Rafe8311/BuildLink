/**
 * API Service
 * Handles all backend API communications using REST
 */

const APIService = {
    // Initialize service
    init() {
        this.baseURL = Config.api.baseURL;
        this.timeout = Config.api.timeout;

        // Get stored tokens
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');

        console.log(Config.shouldUseBackend() ?
            '🔗 API Service initialized (Backend mode)' :
            '📦 API Service initialized (localStorage mode)');
    },

    // Store tokens
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    // Clear tokens
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    // Get auth headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        return headers;
    },

    // Make API request with retry logic
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const maxRetries = Config.api.retryAttempts;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...options,
                    headers: this.getHeaders(options.auth !== false),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const data = await response.json();

                // Handle token expiration
                if (response.status === 401 && data.code === 'TOKEN_EXPIRED') {
                    const refreshed = await this.refreshAccessToken();
                    if (refreshed) {
                        // Retry with new token
                        return this.request(endpoint, options);
                    } else {
                        this.clearTokens();
                        throw new Error('Session expired. Please login again.');
                    }
                }

                if (!response.ok) {
                    throw new Error(data.message || 'Request failed');
                }

                return data;

            } catch (error) {
                if (attempt === maxRetries) {
                    console.error(`API request failed after ${maxRetries} attempts:`, error);
                    throw error;
                }

                // Wait before retry
                await this.delay(Config.api.retryDelay * attempt);
            }
        }
    },

    // Delay helper
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            return false;
        }

        try {
            const data = await this.request('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: this.refreshToken }),
                auth: false
            });

            this.setTokens(data.data.accessToken, this.refreshToken);
            return true;

        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    },

    // Authentication methods
    async signUp(email, password, role, userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, role, ...userData }),
            auth: false
        });

        this.setTokens(data.data.accessToken, data.data.refreshToken);
        return data;
    },

    async signIn(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            auth: false
        });

        this.setTokens(data.data.accessToken, data.data.refreshToken);
        return data;
    },

    async signOut() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });
        } finally {
            this.clearTokens();
        }
    },

    async getCurrentUser() {
        const data = await this.request('/auth/me');
        return data.data.user;
    },

    // Database operations
    async query(table, filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = `/${table}${params ? '?' + params : ''}`;
        const data = await this.request(endpoint);
        return data.data[table] || [];
    },

    async getById(table, id) {
        const data = await this.request(`/${table}/${id}`);
        return data.data[table.slice(0, -1)] || null; // Remove 's' from table name
    },

    async insert(table, record) {
        const data = await this.request(`/${table}`, {
            method: 'POST',
            body: JSON.stringify(record)
        });
        return data.data[table.slice(0, -1)] || data.data;
    },

    async update(table, id, updates) {
        const data = await this.request(`/${table}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return data.data[table.slice(0, -1)] || data.data;
    },

    async delete(table, id) {
        await this.request(`/${table}/${id}`, {
            method: 'DELETE'
        });
        return true;
    },

    // Special endpoints
    async submitContactMessage(message) {
        const data = await this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(message),
            auth: false
        });
        return data;
    },

    async getBuilders(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const data = await this.request(`/users/builders${params ? '?' + params : ''}`);
        return data.data.builders;
    },

    async createQuoteRequest(quoteRequest) {
        const data = await this.request('/quotes/requests', {
            method: 'POST',
            body: JSON.stringify(quoteRequest)
        });
        return data.data.quoteRequest;
    },

    async getQuoteRequests(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const data = await this.request(`/quotes/requests${params ? '?' + params : ''}`);
        return data.data.quoteRequests;
    },

    async submitQuote(quote) {
        const data = await this.request('/quotes', {
            method: 'POST',
            body: JSON.stringify(quote)
        });
        return data.data.quote;
    },

    async getQuotes() {
        const data = await this.request('/quotes');
        return data.data.quotes;
    },

    async acceptQuote(quoteId, notes) {
        const data = await this.request(`/quotes/${quoteId}/accept`, {
            method: 'PUT',
            body: JSON.stringify({ notes })
        });
        return data.data.quote;
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.APIService = APIService;
    APIService.init();
}
