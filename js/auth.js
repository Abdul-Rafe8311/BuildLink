/**
 * Authentication Module
 * Handles user signup, login, logout, and session management
 * Supports both REST API with JWT and localStorage fallback
 */

const Auth = {
    // Check if using backend auth
    useBackendAuth() {
        return typeof Config !== 'undefined' && Config.shouldUseBackend();
    },

    // Get current user from session
    async getCurrentUser() {
        if (this.useBackendAuth()) {
            try {
                const user = await APIService.getCurrentUser();
                return user;
            } catch (error) {
                console.error('Failed to get current user from backend:', error);
                // Fall through to localStorage
            }
        }

        // Fallback to localStorage
        const userData = localStorage.getItem('current_user');
        return userData ? JSON.parse(userData) : null;
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
            // Use REST API - send only required fields
            const result = await APIService.signUp(
                data.email,
                data.password,
                'customer',
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone
                }
            );

            const user = result.data.user;
            this.setSession(user);
            return { user, profile: user };
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
            // Use REST API - send only required fields
            const result = await APIService.signUp(
                data.email,
                data.password,
                'builder',
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    companyName: data.company_name,
                    licenseNumber: data.license_number,
                    yearsExperience: data.years_experience || 0,
                    specializations: data.specializations || [],
                    serviceAreas: data.service_areas || [],
                    bio: data.description,
                    website: data.website
                }
            );

            const user = result.data.user;
            this.setSession(user);
            return { user, profile: user };
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
            // Use REST API
            const result = await APIService.signIn(email, password);
            const user = result.data.user;
            this.setSession(user);
            return user;
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

    // Set user session
    setSession(user) {
        const sessionData = {
            id: user.id || user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
        localStorage.setItem('current_user', JSON.stringify(sessionData));
    },

    // Logout
    async logout() {
        if (this.useBackendAuth()) {
            try {
                await APIService.signOut();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('current_user');
        navigateTo('home');
        updateNavigation();
    },

    // Update profile
    async updateProfile(data) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('Not logged in');

        if (this.useBackendAuth()) {
            // Use REST API
            const result = await APIService.request('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return result.data.user;
        }

        // Fallback to localStorage
        const table = user.role === 'customer' ? 'customer_profiles' : 'builder_profiles';
        const profile = await DB.getOneByField(table, 'user_id', user.id);

        if (profile) {
            return await DB.update(table, profile.id, data);
        }
        return null;
    }
};
