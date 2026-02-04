/**
 * Authentication Module
 * Handles user signup, login, logout, and session management
 * Supports both Supabase Auth and localStorage fallback
 */

const Auth = {
    // Check if using backend auth
    useBackendAuth() {
        return typeof Config !== 'undefined' && Config.shouldUseBackend();
    },

    // Get current user from session
    async getCurrentUser() {
        if (this.useBackendAuth()) {
            const result = await APIService.auth.getSession();
            if (result.success && result.data.session) {
                const user = result.data.session.user;
                return {
                    id: user.id,
                    email: user.email,
                    role: user.user_metadata?.role || 'customer'
                };
            }
        }

        // Fallback to localStorage
        const userData = localStorage.getItem('current_user');
        return userData ? JSON.parse(userData) : null;
    },

    // Get current user's profile
    async getCurrentProfile() {
        const user = await this.getCurrentUser();
        if (!user) return null;

        if (user.role === 'customer') {
            return await DB.getOneByField('customer_profiles', 'user_id', user.id);
        } else if (user.role === 'builder') {
            return await DB.getOneByField('builder_profiles', 'user_id', user.id);
        }
        return null;
    },

    // Check if user is logged in
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return user !== null;
    },

    // Check user role
    async getRole() {
        const user = await this.getCurrentUser();
        return user ? user.role : null;
    },

    // Customer signup
    async signupCustomer(data) {
        if (this.useBackendAuth()) {
            // Use Supabase Auth
            const result = await APIService.auth.signUp(data.email, data.password, {
                role: 'customer',
                full_name: data.full_name
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            const user = result.data.user;

            // Create customer profile
            const profile = await DB.insert('customer_profiles', {
                user_id: user.id,
                full_name: data.full_name,
                phone: data.phone,
                address: data.address
            });

            return { user, profile };
        }

        // Fallback to localStorage
        const existingUser = await DB.getOneByField('users', 'email', data.email);
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }

        const user = await DB.insert('users', {
            email: data.email,
            password: data.password,
            role: 'customer'
        });

        const profile = await DB.insert('customer_profiles', {
            user_id: user.id,
            full_name: data.full_name,
            phone: data.phone,
            address: data.address
        });

        this.setSession(user);
        return { user, profile };
    },

    // Builder signup
    async signupBuilder(data) {
        if (this.useBackendAuth()) {
            // Use Supabase Auth
            const result = await APIService.auth.signUp(data.email, data.password, {
                role: 'builder',
                company_name: data.company_name
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            const user = result.data.user;

            // Create builder profile
            const profile = await DB.insert('builder_profiles', {
                user_id: user.id,
                company_name: data.company_name,
                description: data.description,
                phone: data.phone,
                address: data.address,
                license_number: data.license_number,
                specializations: data.specializations || [],
                rating: 0
            });

            return { user, profile };
        }

        // Fallback to localStorage
        const existingUser = await DB.getOneByField('users', 'email', data.email);
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }

        const user = await DB.insert('users', {
            email: data.email,
            password: data.password,
            role: 'builder'
        });

        const profile = await DB.insert('builder_profiles', {
            user_id: user.id,
            company_name: data.company_name,
            description: data.description,
            phone: data.phone,
            address: data.address,
            license_number: data.license_number,
            specializations: data.specializations || [],
            rating: 0
        });

        this.setSession(user);
        return { user, profile };
    },

    // Login
    async login(email, password) {
        if (this.useBackendAuth()) {
            // Use Supabase Auth
            const result = await APIService.auth.signIn(email, password);

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data.user;
        }

        // Fallback to localStorage
        const user = await DB.getOneByField('users', 'email', email);

        if (!user) {
            throw new Error('No account found with this email');
        }

        if (user.password !== password) {
            throw new Error('Incorrect password');
        }

        this.setSession(user);
        return user;
    },

    // Set user session (localStorage only)
    setSession(user) {
        const sessionData = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        localStorage.setItem('current_user', JSON.stringify(sessionData));
    },

    // Logout
    async logout() {
        if (this.useBackendAuth()) {
            await APIService.auth.signOut();
        }

        localStorage.removeItem('current_user');
        navigateTo('home');
        updateNavigation();
    },

    // Update profile
    async updateProfile(data) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('Not logged in');

        const table = user.role === 'customer' ? 'customer_profiles' : 'builder_profiles';
        const profile = await DB.getOneByField(table, 'user_id', user.id);

        if (profile) {
            return await DB.update(table, profile.id, data);
        }
        return null;
    }
};
