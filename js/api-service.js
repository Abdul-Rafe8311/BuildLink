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

                const rawText = await response.text();
                let data = {};
                if (rawText) {
                    try {
                        data = JSON.parse(rawText);
                    } catch {
                        throw new Error(
                            response.ok
                                ? 'Invalid response from server'
                                : `Server error (${response.status})`
                        );
                    }
                }

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
                const isTimeout = error.name === 'AbortError';
                const netMsg = (error && error.message) || '';
                const isNetworkError = error instanceof TypeError &&
                    /Failed to fetch|NetworkError|Load failed/i.test(netMsg);

                if (isTimeout) {
                    throw new Error('Request timed out. Check that the backend is running.');
                }

                if (isNetworkError) {
                    if (attempt < maxRetries) {
                        await this.delay(Config.api.retryDelay * attempt);
                        continue;
                    }
                    throw new Error(
                        'Cannot reach the API. Start the backend (port 5001) and open the site from http://localhost:8000 or http://127.0.0.1:8000.'
                    );
                }

                // HTTP errors (wrong credentials, validation, etc.) — fail immediately, no retry
                console.error('API request failed:', error);
                throw error;
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

    // Database operations — legacy helpers kept for callers that already
    // know the exact endpoint and rely on the heuristic unwrap.
    async query(table, filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = `/${table}${params ? '?' + params : ''}`;
        const data = await this.request(endpoint);
        return data.data[table] || [];
    },

    async getById(table, id) {
        const data = await this.request(`/${table}/${id}`);
        return data.data[table.slice(0, -1)] || null;
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
        await this.request(`/${table}/${id}`, { method: 'DELETE' });
        return true;
    },

    // Endpoint-aware variants — caller specifies the exact route and the
    // response key. Use these when the table name doesn't map cleanly to
    // the route or response shape (e.g. quote_requests → quotes/requests
    // with response.data.quoteRequests).
    async queryEndpoint(endpoint, pluralKey, filters = {}) {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== null)
        ).toString();
        const url = `/${endpoint}${params ? '?' + params : ''}`;
        const data = await this.request(url);
        return data.data[pluralKey] || [];
    },

    async getByIdEndpoint(endpoint, id, singleKey) {
        const data = await this.request(`/${endpoint}/${id}`);
        return data.data[singleKey] || null;
    },

    async updateEndpoint(endpoint, id, updates, singleKey) {
        const data = await this.request(`/${endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return data.data[singleKey] || data.data;
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

    async getOpenQuoteRequests() {
        const data = await this.request('/quotes/requests/open');
        return data.data.quoteRequests || [];
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
