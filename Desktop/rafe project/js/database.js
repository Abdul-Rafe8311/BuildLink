/**
 * Database Module
 * Supports both Supabase backend and localStorage fallback
 * Automatically switches based on configuration and availability
 */

const DB = {
    // Mode: 'backend' or 'localStorage'
    mode: 'localStorage',

    // Initialize database
    async init() {
        // Check if backend should be used
        if (typeof Config !== 'undefined' && Config.shouldUseBackend()) {
            this.mode = 'backend';
            console.log('🔗 Database initialized in BACKEND mode (Supabase)');
        } else {
            this.mode = 'localStorage';
            this.initLocalStorage();
            console.log('📦 Database initialized in LOCALSTORAGE mode');
        }
    },

    // Initialize localStorage
    initLocalStorage() {
        if (!localStorage.getItem('db_initialized')) {
            localStorage.setItem('users', JSON.stringify([]));
            localStorage.setItem('customer_profiles', JSON.stringify([]));
            localStorage.setItem('builder_profiles', JSON.stringify([]));
            localStorage.setItem('plots', JSON.stringify([]));
            localStorage.setItem('quote_requests', JSON.stringify([]));
            localStorage.setItem('quotes', JSON.stringify([]));
            localStorage.setItem('contact_messages', JSON.stringify([]));
            localStorage.setItem('budget_analyses', JSON.stringify([]));
            localStorage.setItem('db_initialized', 'true');

            // Add some demo builders
            this.seedDemoData();
        }
    },

    // Seed demo data (localStorage only)
    seedDemoData() {
        const demoBuilders = [
            {
                id: this.generateId(),
                email: 'builder1@demo.com',
                password: 'demo123',
                role: 'builder',
                created_at: new Date().toISOString()
            },
            {
                id: this.generateId(),
                email: 'builder2@demo.com',
                password: 'demo123',
                role: 'builder',
                created_at: new Date().toISOString()
            }
        ];

        const builderProfiles = [
            {
                id: this.generateId(),
                user_id: demoBuilders[0].id,
                company_name: 'Elite Construction Co.',
                description: 'Premium residential and commercial construction with 15+ years of experience. Specializing in modern designs and sustainable building practices.',
                phone: '+1 (555) 123-4567',
                address: '123 Builder Street, Construction City',
                license_number: 'LIC-2024-001',
                specializations: ['Residential', 'Commercial', 'Renovation'],
                rating: 4.8
            },
            {
                id: this.generateId(),
                user_id: demoBuilders[1].id,
                company_name: 'BuildRight Solutions',
                description: 'Expert builders focused on quality craftsmanship and timely delivery. From foundation to finishing.',
                phone: '+1 (555) 987-6543',
                address: '456 Construction Ave, Builder Town',
                license_number: 'LIC-2024-002',
                specializations: ['Residential', 'Industrial', 'Green Building'],
                rating: 4.6
            }
        ];

        localStorage.setItem('users', JSON.stringify(demoBuilders));
        localStorage.setItem('builder_profiles', JSON.stringify(builderProfiles));
    },

    // Generate unique ID (for localStorage)
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get all records from a table
    async getAll(table) {
        if (this.mode === 'backend') {
            const result = await APIService.getAll(table);
            if (result.success) {
                return result.data;
            }
            // Fallback to localStorage on error
            if (Config.features.useLocalStorageFallback) {
                console.warn('Backend failed, using localStorage fallback');
                return this.getAll_localStorage(table);
            }
            return [];
        }
        return this.getAll_localStorage(table);
    },

    getAll_localStorage(table) {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    },

    // Get record by ID
    async getById(table, id) {
        if (this.mode === 'backend') {
            const result = await APIService.getById(table, id);
            if (result.success) {
                return result.data;
            }
            if (Config.features.useLocalStorageFallback) {
                return this.getById_localStorage(table, id);
            }
            return null;
        }
        return this.getById_localStorage(table, id);
    },

    getById_localStorage(table, id) {
        const records = this.getAll_localStorage(table);
        return records.find(r => r.id === id) || null;
    },

    // Get records by field value
    async getByField(table, field, value) {
        if (this.mode === 'backend') {
            const result = await APIService.getByField(table, field, value);
            if (result.success) {
                return result.data;
            }
            if (Config.features.useLocalStorageFallback) {
                return this.getByField_localStorage(table, field, value);
            }
            return [];
        }
        return this.getByField_localStorage(table, field, value);
    },

    getByField_localStorage(table, field, value) {
        const records = this.getAll_localStorage(table);
        return records.filter(r => r[field] === value);
    },

    // Get single record by field value
    async getOneByField(table, field, value) {
        if (this.mode === 'backend') {
            const result = await APIService.getByField(table, field, value);
            if (result.success && result.data.length > 0) {
                return result.data[0];
            }
            if (Config.features.useLocalStorageFallback) {
                return this.getOneByField_localStorage(table, field, value);
            }
            return null;
        }
        return this.getOneByField_localStorage(table, field, value);
    },

    getOneByField_localStorage(table, field, value) {
        const records = this.getAll_localStorage(table);
        return records.find(r => r[field] === value) || null;
    },

    // Insert a new record
    async insert(table, record) {
        if (this.mode === 'backend') {
            const result = await APIService.insert(table, record);
            if (result.success) {
                return result.data;
            }
            if (Config.features.useLocalStorageFallback) {
                console.warn('Backend insert failed, using localStorage fallback');
                return this.insert_localStorage(table, record);
            }
            throw new Error(result.error || 'Insert failed');
        }
        return this.insert_localStorage(table, record);
    },

    insert_localStorage(table, record) {
        const records = this.getAll_localStorage(table);
        const newRecord = {
            id: this.generateId(),
            ...record,
            created_at: new Date().toISOString()
        };
        records.push(newRecord);
        localStorage.setItem(table, JSON.stringify(records));
        return newRecord;
    },

    // Update a record
    async update(table, id, updates) {
        if (this.mode === 'backend') {
            const result = await APIService.update(table, id, updates);
            if (result.success) {
                return result.data;
            }
            if (Config.features.useLocalStorageFallback) {
                return this.update_localStorage(table, id, updates);
            }
            return null;
        }
        return this.update_localStorage(table, id, updates);
    },

    update_localStorage(table, id, updates) {
        const records = this.getAll_localStorage(table);
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = { ...records[index], ...updates, updated_at: new Date().toISOString() };
            localStorage.setItem(table, JSON.stringify(records));
            return records[index];
        }
        return null;
    },

    // Delete a record
    async delete(table, id) {
        if (this.mode === 'backend') {
            const result = await APIService.delete(table, id);
            if (result.success) {
                return true;
            }
            if (Config.features.useLocalStorageFallback) {
                return this.delete_localStorage(table, id);
            }
            return false;
        }
        return this.delete_localStorage(table, id);
    },

    delete_localStorage(table, id) {
        const records = this.getAll_localStorage(table);
        const filtered = records.filter(r => r.id !== id);
        localStorage.setItem(table, JSON.stringify(filtered));
        return filtered.length < records.length;
    },

    // Query with conditions
    async query(table, conditions) {
        if (this.mode === 'backend') {
            const result = await APIService.query(table, { filters: conditions });
            if (result.success) {
                return result.data;
            }
            if (Config.features.useLocalStorageFallback) {
                return this.query_localStorage(table, conditions);
            }
            return [];
        }
        return this.query_localStorage(table, conditions);
    },

    query_localStorage(table, conditions) {
        let records = this.getAll_localStorage(table);

        Object.keys(conditions).forEach(key => {
            const value = conditions[key];
            if (value !== undefined && value !== null && value !== '') {
                records = records.filter(r => r[key] === value);
            }
        });

        return records;
    },

    // Join tables (localStorage only - complex joins should use backend views)
    join(table1, table2, foreignKey, localKey = 'id') {
        const records1 = this.getAll_localStorage(table1);
        const records2 = this.getAll_localStorage(table2);

        return records1.map(r1 => {
            const related = records2.filter(r2 => r2[foreignKey] === r1[localKey]);
            return { ...r1, related };
        });
    },

    // Reset database
    reset() {
        localStorage.removeItem('db_initialized');
        localStorage.removeItem('users');
        localStorage.removeItem('customer_profiles');
        localStorage.removeItem('builder_profiles');
        localStorage.removeItem('plots');
        localStorage.removeItem('quote_requests');
        localStorage.removeItem('quotes');
        localStorage.removeItem('contact_messages');
        localStorage.removeItem('budget_analyses');
        localStorage.removeItem('current_user');
        this.initLocalStorage();
    }
};

// Initialize database on load
DB.init();

