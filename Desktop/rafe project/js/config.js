/**
 * Backend Configuration
 * Centralized configuration for Supabase and other backend services
 */

const Config = {
    // Environment
    environment: 'development', // 'development' or 'production'

    // Supabase Configuration
    supabase: {
        url: '', // Set your Supabase project URL here
        anonKey: '', // Set your Supabase anonymous key here

        // Check if Supabase is configured
        isConfigured() {
            return this.url !== '' && this.anonKey !== '';
        }
    },

    // Feature Flags
    features: {
        useBackend: false, // Toggle to enable/disable backend (gradual rollout)
        useLocalStorageFallback: true, // Use localStorage when offline or backend fails
        enableRealtime: false, // Enable Supabase realtime features
        enableEmailVerification: false, // Require email verification on signup
    },

    // API Settings
    api: {
        timeout: 10000, // Request timeout in milliseconds
        retryAttempts: 3, // Number of retry attempts for failed requests
        retryDelay: 1000, // Delay between retries in milliseconds
    },

    // Get Supabase client instance
    getSupabaseClient() {
        if (!this.supabase.isConfigured()) {
            console.warn('Supabase is not configured. Using localStorage fallback.');
            return null;
        }

        // Initialize Supabase client (requires Supabase JS library to be loaded)
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded. Please include the Supabase JS SDK.');
            return null;
        }

        try {
            return supabase.createClient(this.supabase.url, this.supabase.anonKey);
        } catch (error) {
            console.error('Failed to create Supabase client:', error);
            return null;
        }
    },

    // Check if backend should be used
    shouldUseBackend() {
        return this.features.useBackend && this.supabase.isConfigured();
    },

    // Setup wizard for first-time configuration
    setupWizard() {
        console.log('=== BuildQuote Pro Backend Setup ===');
        console.log('To enable backend features:');
        console.log('1. Create a Supabase account at https://supabase.com');
        console.log('2. Create a new project');
        console.log('3. Run the database schema from implementation_plan.md');
        console.log('4. Get your project URL and anon key from Settings > API');
        console.log('5. Update Config.supabase.url and Config.supabase.anonKey in config.js');
        console.log('6. Set Config.features.useBackend = true');
        console.log('=====================================');
    }
};

// Show setup wizard if backend is not configured
if (!Config.supabase.isConfigured() && Config.features.useBackend) {
    Config.setupWizard();
}
