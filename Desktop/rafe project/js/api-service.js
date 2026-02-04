/**
 * API Service Layer
 * Centralized service for all backend operations with error handling and retry logic
 */

const APIService = {
    // Supabase client instance
    client: null,

    // Initialize the service
    init() {
        if (Config.shouldUseBackend()) {
            this.client = Config.getSupabaseClient();
            if (this.client) {
                console.log('✅ API Service initialized with Supabase backend');
            } else {
                console.warn('⚠️ Failed to initialize Supabase client');
            }
        } else {
            console.log('📦 API Service using localStorage mode');
        }
    },

    // Check if backend is available
    isBackendAvailable() {
        return this.client !== null;
    },

    // Generic error handler
    handleError(error, operation = 'Operation') {
        console.error(`${operation} failed:`, error);

        // User-friendly error messages
        const errorMessages = {
            'auth/invalid-email': 'Invalid email address',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/weak-password': 'Password should be at least 6 characters',
            'network-error': 'Network error. Please check your connection.',
            'timeout': 'Request timed out. Please try again.',
        };

        const message = errorMessages[error.code] || error.message || 'An unexpected error occurred';
        return { success: false, error: message };
    },

    // Retry logic for failed requests
    async retry(fn, attempts = Config.api.retryAttempts) {
        for (let i = 0; i < attempts; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === attempts - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, Config.api.retryDelay));
            }
        }
    },

    // Generic query wrapper
    async query(table, options = {}) {
        if (!this.isBackendAvailable()) {
            return { success: false, error: 'Backend not available' };
        }

        try {
            let query = this.client.from(table).select(options.select || '*');

            // Apply filters
            if (options.filters) {
                Object.entries(options.filters).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            // Apply ordering
            if (options.orderBy) {
                query = query.order(options.orderBy.column, {
                    ascending: options.orderBy.ascending !== false
                });
            }

            // Apply limit
            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return this.handleError(error, 'Query');
        }
    },

    // Insert record
    async insert(table, record) {
        if (!this.isBackendAvailable()) {
            return { success: false, error: 'Backend not available' };
        }

        try {
            const { data, error } = await this.client
                .from(table)
                .insert(record)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return this.handleError(error, 'Insert');
        }
    },

    // Update record
    async update(table, id, updates) {
        if (!this.isBackendAvailable()) {
            return { success: false, error: 'Backend not available' };
        }

        try {
            const { data, error } = await this.client
                .from(table)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return this.handleError(error, 'Update');
        }
    },

    // Delete record
    async delete(table, id) {
        if (!this.isBackendAvailable()) {
            return { success: false, error: 'Backend not available' };
        }

        try {
            const { error } = await this.client
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            return this.handleError(error, 'Delete');
        }
    },

    // Get all records from a table
    async getAll(table) {
        return await this.query(table);
    },

    // Get record by ID
    async getById(table, id) {
        if (!this.isBackendAvailable()) {
            return { success: false, error: 'Backend not available' };
        }

        try {
            const { data, error } = await this.client
                .from(table)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return this.handleError(error, 'Get by ID');
        }
    },

    // Get records by field value
    async getByField(table, field, value) {
        return await this.query(table, {
            filters: { [field]: value }
        });
    },

    // Authentication methods
    auth: {
        // Sign up
        async signUp(email, password, metadata = {}) {
            if (!APIService.isBackendAvailable()) {
                return { success: false, error: 'Backend not available' };
            }

            try {
                const { data, error } = await APIService.client.auth.signUp({
                    email,
                    password,
                    options: {
                        data: metadata
                    }
                });

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                return APIService.handleError(error, 'Sign up');
            }
        },

        // Sign in
        async signIn(email, password) {
            if (!APIService.isBackendAvailable()) {
                return { success: false, error: 'Backend not available' };
            }

            try {
                const { data, error } = await APIService.client.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                return APIService.handleError(error, 'Sign in');
            }
        },

        // Sign out
        async signOut() {
            if (!APIService.isBackendAvailable()) {
                return { success: false, error: 'Backend not available' };
            }

            try {
                const { error } = await APIService.client.auth.signOut();
                if (error) throw error;
                return { success: true };
            } catch (error) {
                return APIService.handleError(error, 'Sign out');
            }
        },

        // Get current session
        async getSession() {
            if (!APIService.isBackendAvailable()) {
                return { success: false, error: 'Backend not available' };
            }

            try {
                const { data, error } = await APIService.client.auth.getSession();
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                return APIService.handleError(error, 'Get session');
            }
        },

        // Get current user
        async getUser() {
            if (!APIService.isBackendAvailable()) {
                return { success: false, error: 'Backend not available' };
            }

            try {
                const { data, error } = await APIService.client.auth.getUser();
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                return APIService.handleError(error, 'Get user');
            }
        }
    }
};

// Initialize on load
if (typeof Config !== 'undefined') {
    APIService.init();
}
