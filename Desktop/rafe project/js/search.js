/**
 * Global Search System
 * Search modal with Cmd+K shortcut and quick actions
 */

const SearchSystem = {
    isOpen: false,
    selectedIndex: 0,
    searchResults: [],

    // Searchable content
    searchableContent: {
        pages: [
            { title: 'Home', description: 'Main landing page', icon: '🏠', action: () => navigateTo('home') },
            { title: 'About Us', description: 'Learn about BuildQuote Pro', icon: 'ℹ️', action: () => navigateTo('about') },
            { title: 'Contact', description: 'Get in touch with us', icon: '📞', action: () => navigateTo('contact') },
            { title: 'Project Gallery', description: 'Browse completed projects', icon: '📸', action: () => navigateTo('gallery') },
            { title: 'Customer Signup', description: 'Register as a property owner', icon: '👤', action: () => navigateTo('customer-signup') },
            { title: 'Builder Signup', description: 'Join as a construction professional', icon: '👷', action: () => navigateTo('builder-signup') },
            { title: 'Login', description: 'Sign in to your account', icon: '🔐', action: () => navigateTo('login') }
        ],
        actions: [
            { title: 'Get a Quote', description: 'Request quotes from builders', icon: '💰', action: () => navigateTo('customer-signup') },
            { title: 'Toggle Theme', description: 'Switch between light/dark mode', icon: '🎨', action: () => ThemeManager.toggle() },
            { title: 'Chat with BuildBot', description: 'Open AI assistant', icon: '🤖', action: () => ChatBot?.toggleChat() }
        ],
        faqs: [
            { title: 'How does BuildQuote Pro work?', description: 'FAQ', icon: '❓', action: () => navigateTo('home') },
            { title: 'Is it free to get quotes?', description: 'FAQ', icon: '❓', action: () => navigateTo('home') },
            { title: 'How are builders verified?', description: 'FAQ', icon: '❓', action: () => navigateTo('home') },
            { title: 'What payment methods are accepted?', description: 'FAQ', icon: '❓', action: () => navigateTo('contact') }
        ],
        builders: [
            { title: 'Elite Construction', description: 'Top Rated Builder - Residential', icon: '🏗️', action: () => navigateTo('builder-signup') },
            { title: 'BuildRight Solutions', description: 'Verified Builder - Commercial', icon: '🏗️', action: () => navigateTo('builder-signup') },
            { title: 'HomeStyle Builders', description: 'Popular Builder - Renovation', icon: '🏗️', action: () => navigateTo('builder-signup') }
        ]
    },

    init() {
        this.createSearchModal();
        this.attachEventListeners();
        console.log('🔍 Search System initialized');
    },

    createSearchModal() {
        if (document.getElementById('search-overlay')) return;

        const modalHTML = `
            <div class="search-overlay" id="search-overlay">
                <div class="search-modal" id="search-modal">
                    <div class="search-input-wrapper">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="search-input" placeholder="Search pages, builders, FAQs..." autocomplete="off">
                        <span class="search-shortcut">ESC</span>
                    </div>
                    <div class="search-results" id="search-results">
                        ${this.renderDefaultResults()}
                    </div>
                    <div class="search-footer">
                        <div class="shortcuts">
                            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                            <span><kbd>↵</kbd> Select</span>
                            <span><kbd>ESC</kbd> Close</span>
                        </div>
                        <span>Powered by BuildQuote Pro</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    renderDefaultResults() {
        return `
            <div class="search-section">
                <div class="search-section-title">Quick Actions</div>
                ${this.searchableContent.actions.map((item, i) => this.renderResultItem(item, i)).join('')}
            </div>
            <div class="search-section">
                <div class="search-section-title">Pages</div>
                ${this.searchableContent.pages.slice(0, 4).map((item, i) => this.renderResultItem(item, i + 3)).join('')}
            </div>
        `;
    },

    renderResultItem(item, index) {
        return `
            <div class="search-result-item ${index === this.selectedIndex ? 'selected' : ''}" 
                 data-index="${index}" 
                 onclick="SearchSystem.executeResult(${index})">
                <div class="result-icon">${item.icon}</div>
                <div class="result-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Keyboard shortcut: Cmd+K or Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            if (this.isOpen) {
                if (e.key === 'Escape') {
                    this.close();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateResults(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateResults(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelected();
                }
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            const overlay = document.getElementById('search-overlay');
            const modal = document.getElementById('search-modal');
            if (overlay && e.target === overlay) {
                this.close();
            }
        });

        // Search input handler
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-input') {
                this.handleSearch(e.target.value);
            }
        });
    },

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');

        if (overlay) {
            this.isOpen = true;
            overlay.classList.add('active');

            if (input) {
                input.value = '';
                input.focus();
            }

            this.selectedIndex = 0;
            this.updateResults(this.renderDefaultResults());
        }
    },

    close() {
        const overlay = document.getElementById('search-overlay');

        if (overlay) {
            this.isOpen = false;
            overlay.classList.remove('active');
        }
    },

    handleSearch(query) {
        if (!query.trim()) {
            this.updateResults(this.renderDefaultResults());
            return;
        }

        const lowerQuery = query.toLowerCase();
        this.searchResults = [];

        // Search through all content
        Object.entries(this.searchableContent).forEach(([category, items]) => {
            items.forEach(item => {
                if (item.title.toLowerCase().includes(lowerQuery) ||
                    item.description.toLowerCase().includes(lowerQuery)) {
                    this.searchResults.push({ ...item, category });
                }
            });
        });

        this.selectedIndex = 0;
        this.renderSearchResults();
    },

    renderSearchResults() {
        if (this.searchResults.length === 0) {
            this.updateResults(`
                <div class="search-section">
                    <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <span style="font-size: 2rem; display: block; margin-bottom: 10px;">🔍</span>
                        <p>No results found</p>
                    </div>
                </div>
            `);
            return;
        }

        const html = `
            <div class="search-section">
                <div class="search-section-title">Results (${this.searchResults.length})</div>
                ${this.searchResults.map((item, i) => this.renderResultItem(item, i)).join('')}
            </div>
        `;

        this.updateResults(html);
    },

    updateResults(html) {
        const results = document.getElementById('search-results');
        if (results) {
            results.innerHTML = html;
        }
    },

    navigateResults(direction) {
        const items = document.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        this.selectedIndex += direction;

        if (this.selectedIndex < 0) {
            this.selectedIndex = items.length - 1;
        } else if (this.selectedIndex >= items.length) {
            this.selectedIndex = 0;
        }

        items.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedIndex);
        });

        items[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
    },

    executeSelected() {
        const items = document.querySelectorAll('.search-result-item');
        if (items[this.selectedIndex]) {
            items[this.selectedIndex].click();
        }
    },

    executeResult(index) {
        const query = document.getElementById('search-input')?.value;

        let item;
        if (query && this.searchResults.length > 0) {
            item = this.searchResults[index];
        } else {
            // Get from default results
            const allDefaults = [
                ...this.searchableContent.actions,
                ...this.searchableContent.pages.slice(0, 4)
            ];
            item = allDefaults[index];
        }

        if (item && item.action) {
            this.close();
            item.action();
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    SearchSystem.init();
});
