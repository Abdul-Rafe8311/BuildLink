/**
 * Theme Manager - Light/Dark Mode Toggle
 * Handles theme switching with smooth transitions and localStorage persistence
 */

const ThemeManager = {
    STORAGE_KEY: 'buildquote-theme',
    DARK: 'dark',
    LIGHT: 'light',

    // Initialize theme on page load
    init() {
        const savedTheme = this.getSavedTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Use saved theme, or system preference, or default to dark
        const theme = savedTheme || (prefersDark ? this.DARK : this.DARK);
        this.setTheme(theme, false);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getSavedTheme()) {
                this.setTheme(e.matches ? this.DARK : this.LIGHT);
            }
        });
    },

    // Get saved theme from localStorage
    getSavedTheme() {
        return localStorage.getItem(this.STORAGE_KEY);
    },

    // Get current theme
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || this.DARK;
    },

    // Set theme
    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);

        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }

        // Update meta theme-color for mobile browsers
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = theme === this.DARK ? '#0a0a1a' : '#fafaff';
        }

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    // Toggle between light and dark
    toggle() {
        const current = this.getCurrentTheme();
        const newTheme = current === this.DARK ? this.LIGHT : this.DARK;
        this.setTheme(newTheme);

        // Add a fun animation to the toggle
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.classList.add('switching');
            setTimeout(() => toggle.classList.remove('switching'), 500);
        }

        return newTheme;
    },

    // Check if dark mode
    isDark() {
        return this.getCurrentTheme() === this.DARK;
    }
};

// Create the theme toggle button HTML
function createThemeToggle() {
    return `
        <button class="theme-toggle" onclick="ThemeManager.toggle()" aria-label="Toggle theme" title="Toggle light/dark mode">
            <span class="stars"></span>
        </button>
    `;
}

// Add additional theme toggle styles
function addThemeToggleStyles() {
    if (document.getElementById('theme-toggle-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'theme-toggle-styles';
    styles.textContent = `
        .theme-toggle.switching {
            animation: toggleBounce 0.5s var(--transition-spring);
        }

        @keyframes toggleBounce {
            0% { transform: scale(1); }
            30% { transform: scale(0.9) rotate(-10deg); }
            50% { transform: scale(1.1) rotate(5deg); }
            70% { transform: scale(0.95) rotate(-3deg); }
            100% { transform: scale(1) rotate(0deg); }
        }

        /* Smooth transition for theme changes */
        html.theme-transitioning,
        html.theme-transitioning *,
        html.theme-transitioning *::before,
        html.theme-transitioning *::after {
            transition: all 0.3s ease !important;
            transition-delay: 0s !important;
        }

        /* Theme toggle in navigation */
        .nav-auth .theme-toggle {
            margin-right: var(--space-2);
        }

        /* Mobile-friendly theme toggle */
        @media (max-width: 768px) {
            .theme-toggle {
                width: 50px;
                height: 28px;
            }

            .theme-toggle::before {
                width: 20px;
                height: 20px;
                font-size: 12px;
            }

            [data-theme="light"] .theme-toggle::before {
                left: calc(100% - 24px);
            }
        }
    `;
    document.head.appendChild(styles);
}

// Initialize theme on script load
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    addThemeToggleStyles();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    ThemeManager.init();
    addThemeToggleStyles();
}
