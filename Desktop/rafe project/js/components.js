/**
 * Reusable UI Components
 */

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">×</span>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Modal
function showModal(title, content, actions = []) {
    const container = document.getElementById('modal-container');

    const actionsHtml = actions.map(action =>
        `<button class="btn ${action.class || 'btn-primary'}" onclick="${action.onclick}">${action.text}</button>`
    ).join('');

    container.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${actions.length ? `<div class="modal-footer">${actionsHtml}</div>` : ''}
            </div>
        </div>
    `;
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// Loading Spinner
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading-overlay';
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) loader.remove();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Time ago
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

// Get initials from name
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Status badge
function getStatusBadge(status) {
    const statusMap = {
        'open': { class: 'badge-success', label: 'Open' },
        'in_progress': { class: 'badge-warning', label: 'In Progress' },
        'closed': { class: 'badge-neutral', label: 'Closed' },
        'pending': { class: 'badge-warning', label: 'Pending' },
        'accepted': { class: 'badge-success', label: 'Accepted' },
        'rejected': { class: 'badge-error', label: 'Rejected' }
    };

    const config = statusMap[status] || { class: 'badge-neutral', label: status };
    return `<span class="badge ${config.class}">${config.label}</span>`;
}

// Validate form
function validateForm(formData, rules) {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const value = formData[field];
        const fieldRules = rules[field];

        if (fieldRules.required && (!value || value.trim() === '')) {
            errors[field] = `${fieldRules.label || field} is required`;
        } else if (fieldRules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = 'Please enter a valid email address';
        } else if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
            errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
        } else if (fieldRules.match && value !== formData[fieldRules.match]) {
            errors[field] = `${fieldRules.label || field} does not match`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Show form errors
function showFormErrors(errors, form) {
    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Show new errors
    Object.keys(errors).forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            errorEl.textContent = errors[field];
            input.parentElement.appendChild(errorEl);
        }
    });
}

// Clear form
function clearForm(form) {
    form.reset();
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Create stat card
function createStatCard(value, label, icon) {
    return `
        <div class="card stat-card">
            <div class="icon">${icon}</div>
            <div class="value">${value}</div>
            <div class="label">${label}</div>
        </div>
    `;
}
