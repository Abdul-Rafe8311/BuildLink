/**
 * Global Notification System
 * Real-time notifications for quotes, messages, and updates
 */

const NotificationSystem = {
    notifications: [],
    unreadCount: 0,
    isOpen: false,

    // Sample notifications for demo
    sampleNotifications: [
        {
            id: 1,
            type: 'quote',
            icon: '💰',
            title: 'New Quote Received',
            message: 'Elite Construction submitted a quote for your Kitchen Renovation project.',
            time: '5 minutes ago',
            unread: true
        },
        {
            id: 2,
            type: 'message',
            icon: '💬',
            title: 'New Message',
            message: 'BuildRight Solutions sent you a message about material options.',
            time: '1 hour ago',
            unread: true
        },
        {
            id: 3,
            type: 'update',
            icon: '🏗️',
            title: 'Project Update',
            message: 'Your Home Renovation project is now 75% complete!',
            time: '3 hours ago',
            unread: false
        },
        {
            id: 4,
            type: 'success',
            icon: '✅',
            title: 'Quote Accepted',
            message: 'You accepted the quote from HomeStyle Builders.',
            time: 'Yesterday',
            unread: false
        },
        {
            id: 5,
            type: 'reminder',
            icon: '📅',
            title: 'Upcoming Appointment',
            message: 'Site inspection scheduled for tomorrow at 10:00 AM.',
            time: '2 days ago',
            unread: false
        }
    ],

    init() {
        this.notifications = [...this.sampleNotifications];
        this.updateUnreadCount();
        this.injectNotificationBell();
        this.attachEventListeners();
        console.log('🔔 Notification System initialized');
    },

    injectNotificationBell() {
        // Find the nav-auth element and inject notification bell before theme toggle
        const navAuth = document.getElementById('nav-auth');
        if (!navAuth) return;

        // Check if bell already exists
        if (document.getElementById('notification-bell')) return;

        const bellHTML = `
            <div class="notification-wrapper" id="notification-wrapper" style="position: relative;">
                <button class="notification-bell" id="notification-bell" aria-label="Notifications">
                    🔔
                    ${this.unreadCount > 0 ? `<span class="notification-badge" id="notification-badge">${this.unreadCount}</span>` : ''}
                </button>
                <div class="notification-dropdown" id="notification-dropdown">
                    <div class="notification-header">
                        <h4>Notifications</h4>
                        <button onclick="NotificationSystem.markAllRead()">Mark all read</button>
                    </div>
                    <div class="notification-list" id="notification-list">
                        ${this.renderNotifications()}
                    </div>
                </div>
            </div>
        `;

        // Insert at the beginning of nav-auth
        navAuth.insertAdjacentHTML('afterbegin', bellHTML);
    },

    renderNotifications() {
        if (this.notifications.length === 0) {
            return `
                <div class="notification-empty">
                    <span>🔔</span>
                    <p>No notifications yet</p>
                </div>
            `;
        }

        return this.notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}" data-id="${notif.id}" onclick="NotificationSystem.handleClick(${notif.id})">
                <div class="notification-icon">${notif.icon}</div>
                <div class="notification-content">
                    <p><strong>${notif.title}</strong><br>${notif.message}</p>
                    <span class="time">${notif.time}</span>
                </div>
            </div>
        `).join('');
    },

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            const wrapper = document.getElementById('notification-wrapper');
            const bell = document.getElementById('notification-bell');
            const dropdown = document.getElementById('notification-dropdown');

            if (bell && bell.contains(e.target)) {
                this.toggleDropdown();
            } else if (wrapper && !wrapper.contains(e.target)) {
                this.closeDropdown();
            }
        });
    },

    toggleDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) {
            this.isOpen = !this.isOpen;
            dropdown.classList.toggle('active', this.isOpen);
        }
    },

    closeDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) {
            this.isOpen = false;
            dropdown.classList.remove('active');
        }
    },

    handleClick(id) {
        this.markAsRead(id);
        // In a real app, this would navigate to the relevant page
        this.showToast('Opening notification...');
    },

    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif && notif.unread) {
            notif.unread = false;
            this.updateUnreadCount();
            this.refreshUI();
        }
    },

    markAllRead() {
        this.notifications.forEach(n => n.unread = false);
        this.updateUnreadCount();
        this.refreshUI();
        this.showToast('All notifications marked as read');
    },

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => n.unread).length;
    },

    refreshUI() {
        const list = document.getElementById('notification-list');
        const badge = document.getElementById('notification-badge');

        if (list) {
            list.innerHTML = this.renderNotifications();
        }

        if (this.unreadCount > 0) {
            if (badge) {
                badge.textContent = this.unreadCount;
            } else {
                const bell = document.getElementById('notification-bell');
                if (bell) {
                    bell.insertAdjacentHTML('beforeend', `<span class="notification-badge" id="notification-badge">${this.unreadCount}</span>`);
                }
            }
        } else if (badge) {
            badge.remove();
        }
    },

    addNotification(notification) {
        const newNotif = {
            id: Date.now(),
            unread: true,
            time: 'Just now',
            ...notification
        };
        this.notifications.unshift(newNotif);
        this.updateUnreadCount();
        this.refreshUI();
        this.showToast(`New: ${notification.title}`, 'info');
    },

    showToast(message, type = 'success') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to allow nav to render
    setTimeout(() => {
        NotificationSystem.init();
    }, 500);
});

// Re-initialize when navigation changes
const originalNavigateTo = window.navigateTo;
if (originalNavigateTo) {
    window.navigateTo = function (...args) {
        const result = originalNavigateTo.apply(this, args);
        setTimeout(() => {
            NotificationSystem.injectNotificationBell();
        }, 100);
        return result;
    };
}
