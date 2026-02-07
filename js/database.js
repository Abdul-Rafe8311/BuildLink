/**
 * Database Module
 * Handles data persistence with REST API backend and localStorage fallback
 */

const DB = {
    // Check if using backend
    useBackend() {
        return typeof Config !== 'undefined' && Config.shouldUseBackend();
    },

    // Initialize database
    async init() {
        if (this.useBackend()) {
            console.log('🔗 Database initialized in BACKEND mode (REST API)');
        } else {
            console.log('📦 Database initialized in LOCALSTORAGE mode');
            this.seedDemoData();
        }
    },

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get all records from a table
    async getAll(table) {
        if (this.useBackend()) {
            try {
                return await APIService.query(table);
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    },

    // Get record by ID
    async getById(table, id) {
        if (this.useBackend()) {
            try {
                return await APIService.getById(table, id);
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        const records = await this.getAll(table);
        return records.find(r => r.id === id || r._id === id) || null;
    },

    // Get one record by field value
    async getOneByField(table, field, value) {
        const records = await this.getAll(table);
        return records.find(r => r[field] === value) || null;
    },

    // Insert new record
    async insert(table, record) {
        if (this.useBackend()) {
            try {
                // Map table names to API endpoints
                const endpoint = this.getEndpointForTable(table);
                if (endpoint) {
                    return await APIService.insert(endpoint, record);
                }
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        const records = await this.getAll(table);
        const newRecord = {
            id: this.generateId(),
            ...record,
            created_at: new Date().toISOString()
        };
        records.push(newRecord);
        localStorage.setItem(table, JSON.stringify(records));
        return newRecord;
    },

    // Update record
    async update(table, id, updates) {
        if (this.useBackend()) {
            try {
                const endpoint = this.getEndpointForTable(table);
                if (endpoint) {
                    return await APIService.update(endpoint, id, updates);
                }
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        const records = await this.getAll(table);
        const index = records.findIndex(r => r.id === id || r._id === id);

        if (index !== -1) {
            records[index] = {
                ...records[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem(table, JSON.stringify(records));
            return records[index];
        }
        return null;
    },

    // Delete record
    async delete(table, id) {
        if (this.useBackend()) {
            try {
                const endpoint = this.getEndpointForTable(table);
                if (endpoint) {
                    return await APIService.delete(endpoint, id);
                }
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        const records = await this.getAll(table);
        const filtered = records.filter(r => r.id !== id && r._id !== id);
        localStorage.setItem(table, JSON.stringify(filtered));
        return true;
    },

    // Query with filters
    async query(table, filters = {}) {
        if (this.useBackend()) {
            try {
                return await APIService.query(table, filters);
            } catch (error) {
                console.error(`Backend error, falling back to localStorage:`, error);
            }
        }

        // localStorage fallback
        let records = await this.getAll(table);

        Object.keys(filters).forEach(key => {
            records = records.filter(r => r[key] === filters[key]);
        });

        return records;
    },

    // Map table names to API endpoints
    getEndpointForTable(table) {
        const mapping = {
            'contact_messages': 'contact',
            'plots': 'plots',
            'quote_requests': 'quotes/requests',
            'quotes': 'quotes',
            'users': 'users',
            'customer_profiles': 'users',
            'builder_profiles': 'users'
        };
        return mapping[table] || table;
    },

    // Seed demo data (localStorage only)
    seedDemoData() {
        if (localStorage.getItem('db_initialized')) return;

        // Demo users
        const users = [
            {
                id: 'user_1',
                email: 'customer@example.com',
                password: 'password123',
                role: 'customer',
                created_at: new Date().toISOString()
            },
            {
                id: 'user_2',
                email: 'builder@example.com',
                password: 'password123',
                role: 'builder',
                created_at: new Date().toISOString()
            }
        ];

        // Demo customer profiles
        const customerProfiles = [
            {
                id: 'cp_1',
                user_id: 'user_1',
                full_name: 'John Doe',
                phone: '555-0123',
                address: '123 Main St, City, State',
                created_at: new Date().toISOString()
            }
        ];

        // Demo builder profiles
        const builderProfiles = [
            {
                id: 'bp_1',
                user_id: 'user_2',
                company_name: 'Quality Builders Inc',
                description: 'Professional construction services',
                phone: '555-0456',
                address: '456 Builder Ave, City, State',
                license_number: 'LIC123456',
                specializations: ['Residential', 'Commercial'],
                rating: 4.5,
                created_at: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('customer_profiles', JSON.stringify(customerProfiles));
        localStorage.setItem('builder_profiles', JSON.stringify(builderProfiles));
        localStorage.setItem('plots', JSON.stringify([]));
        localStorage.setItem('quote_requests', JSON.stringify([]));
        localStorage.setItem('quotes', JSON.stringify([]));
        localStorage.setItem('contact_messages', JSON.stringify([]));
        localStorage.setItem('db_initialized', 'true');

        console.log('✅ Demo data seeded');
    },

    // Reset database (localStorage only)
    reset() {
        localStorage.clear();
        this.seedDemoData();
        console.log('🔄 Database reset complete');
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.DB = DB;
    DB.init();
}
